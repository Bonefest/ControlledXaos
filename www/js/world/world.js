import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import { Colormap } from './colormap.js';
import { GeneralScreen } from './general_screen.js';
import { AttractorScreen } from './attractor_screen.js';

import { OrbitControls } from '../vendor/OrbitControls.js';

let scene;
let camera;
let controls;
let renderer;
let colormap;
let currentAttractor;
let visualizationClock;

let pointsBufferSize = { BufferSize: 50000 };
let pointsMultiplier = new THREE.Vector3(10, 10, 10);

class World
{
    
    constructor(container)
    {
        this.initRenderer(container);
        this.initSceneElements(container);
        this.initGUI();

        this.attractorGenerationIter = 0;
        this.attractorGenerationEnabled = false;
        this.setAttractor(attractors.AttractorsPrototypes[0]);
    }

    initRenderer(container)
    {
        this.render = this.render.bind(this);
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.append(renderer.domElement);
    }

    initSceneElements(container)
    {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 15;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        visualizationClock = new THREE.Clock();

        colormap = new Colormap(1024);
        colormap.generateColors(40, 45, 172, 193);
    }

    initGUI()
    {
        this['general'] = new GeneralScreen(this);
        // this['popular'] = new PopularScreen(this);
        // this['favourites'] = new Favourites(this);
        this['attractor'] = new AttractorScreen(this);        

        let restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => { this.beginGenerateAttractor(this); });

        let likeBtn = document.getElementById('like-btn');
        likeBtn.addEventListener('click', () => { this.onLikeClicked(this); });
    }

    setAttractor(Prototype)
    {
        currentAttractor = new Prototype();
        this.calculateAttractor();
    }

    beginGenerateAttractor(owner)
    {
        let screen = document.getElementById('screen');
        screen.innerHTML =
`
<div class="container-fluid p-0 vh-100" style="background-color: rgba(255, 255, 255, 0.1);">
  <div class="row align-items-center h-100">
    <div class="col-10 offset-1">
      <div class="row pb-2 g-0">
        <div class="col-7">
          <h6 style='color: white;' id='calc-title'></h6>
        </div>
        <div class="col-3 offset-2 d-grid">
          <button type="button" class="btn btn-outline-danger rounded-0 text-white" id="stop-calcs-button">Stop</button>
        </div>
      </div>

      <div class="row p-0 m-0 g-0">
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="calculation-progress"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
        owner.attractorGenerationIter = 0;
        owner.attractorGenerationEnabled = true;

        let stopBtn = document.getElementById('stop-calcs-button');
        stopBtn.addEventListener('click', () =>
        {
            owner.attractorGenerationEnabled = false;
            owner.calculateAttractor();
            colormap.generateColors(THREE.MathUtils.randFloat(40, 70),
                                    THREE.MathUtils.randFloat(40, 70),
                                    THREE.MathUtils.randFloat(0, 360),
                                    THREE.MathUtils.randFloat(0, 360));

            screen.innerHTML = '';
        });
    }

    generateAttractorLoop(owner)
    {
        if(!owner.attractorGenerationEnabled)
        {
            return;
        }

        const MaxAttempts = 10000;
        
        for(let i = 0; i < 7 && owner.attractorGenerationIter < MaxAttempts; i++, owner.attractorGenerationIter++)
        {
            currentAttractor.generateWeights();
            let L = attractors.calculateLyapunovExponent(currentAttractor);

            if(L > 0.3 && L < 10.0)
            {
                owner.attractorGenerationEnabled = false;
                owner.calculateAttractor();
                colormap.generateColors(THREE.MathUtils.randFloat(40, 70),
                                        THREE.MathUtils.randFloat(40, 70),
                                        THREE.MathUtils.randFloat(0, 360),
                                        THREE.MathUtils.randFloat(0, 360));

                break;

            }

        }

        if(!owner.attractorGenerationEnabled || owner.attractorGenerationIter >= MaxAttempts)
        {
            owner.attractorGenerationEnabled = false;
            
            let screen = document.getElementById('screen');            
            screen.innerHTML = '';
        }
        else
        {
            let progressBar = document.getElementById('calculation-progress');
            if(progressBar != null)
            {
                let percent = (owner.attractorGenerationIter / MaxAttempts) * 100;
                progressBar.style = `width: ${percent}%;`;
            }

            let title = document.getElementById('calc-title');
            if(title != null)
            {
                title.innerHTML = `Searching for attractor (${owner.attractorGenerationIter}/${MaxAttempts})`;
            }
        }
    }

    
    calculateAttractor()
    {
        scene.remove.apply(scene, scene.children);
        visualizationClock.start();
        
        const vertices = [];

        let aabbMin = new THREE.Vector3(9999, 9999, 9999);
        let aabbMax = new THREE.Vector3(-9999, -9999, -9999);
        
        let state = new THREE.Vector3();
        for(let i = 0; i < pointsBufferSize.BufferSize; i++)
        {
            state = currentAttractor.generateState(state);
            vertices.push(state.x * pointsMultiplier.x, state.y * pointsMultiplier.y, state.z * pointsMultiplier.z);

            aabbMin.x = Math.min(aabbMin.x, state.x);
            aabbMin.y = Math.min(aabbMin.y, state.y);
            aabbMin.z = Math.min(aabbMin.z, state.z);

            aabbMax.x = Math.max(aabbMax.x, state.x);
            aabbMax.y = Math.max(aabbMax.y, state.y);
            aabbMax.z = Math.max(aabbMax.z, state.z);
        }

        let aabbDiagonal = new THREE.Vector4();
        aabbDiagonal.w = aabbMin.distanceTo(aabbMax);        
        aabbDiagonal.x = (aabbMax.x - aabbMin.x) / aabbDiagonal.w;
        aabbDiagonal.y = (aabbMax.y - aabbMin.y) / aabbDiagonal.w;
        aabbDiagonal.z = (aabbMax.z - aabbMin.z) / aabbDiagonal.w;

        console.log(aabbMin);
        console.log(aabbMax);
        console.log(aabbDiagonal);        
        
        const material = new THREE.ShaderMaterial({

            uniforms:
            {
                time: { value: 0.0 },
                colormapTex: { value: colormap.getTexture() },
                aabbMin: {value: aabbMin },
                aabbMax: {value: aabbMax },
                aabbDiagonal: {value: aabbDiagonal },
            },

            vertexShader: document.getElementById('particlesVertexShader').textContent,
            fragmentShader: document.getElementById('particlesFragmentShader').textContent,            
        });

        material.transparent = true;
        material.depthTest = false;
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const points = new THREE.Points(geometry, material);
        points.onBeforeRender = function(renderer, scene, camera, geometry, material, group)
        {
            material.uniforms.time.value = visualizationClock.getElapsedTime();
        };

        scene.add(points);
    }
        
    render()
    {
        requestAnimationFrame(this.render);

        if(this.attractorGenerationEnabled)
        {
            this.generateAttractorLoop(this);
        }
        else
        {
            controls.update();
            renderer.render(scene, camera);
        }
    }

    onLikeClicked(owner)
    {
        let likeBtn = document.getElementById('like-btn-icon');        
        likeBtn.classList.toggle('far');
        likeBtn.classList.toggle('fas');

        db.put({_id: new Date().toISOString(), title: 'test'});
        
        let liked = likeBtn.classList.contains('fas');
        if(liked)
        {

        }
    }
}

export { World };
