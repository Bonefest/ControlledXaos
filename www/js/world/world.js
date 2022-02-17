import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
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

class Colormap
{
    constructor(samplesCount)
    {
        this.samplesCount = samplesCount;
        this._generateTexture(new Array(samplesCount).fill(new THREE.Vector3()));
    }
    
    setColors(colors)
    {
        this._updateData(colors);
    }

    generateColors(startL, endL, startH, endH)
    {
        let colors = new Array();

        for(let i = 0; i < this.samplesCount; i++)
        {
            let t = i / this.samplesCount;
            let l = (1 - t) * startL + t * endL;
            let h = (1 - t) * startH + t * endH;
            
            colors.push(new THREE.Color().setHSL(h / 360.0, 0.5, l / 100.0));
        }

        this._updateData(colors);
    }

    getTexture()
    {
        return this.texture;
    }

    _updateData(colors)
    {
        const stride = 4;
        for(let i = 0; i < colors.length; i++)
        {
            let color = colors[i];
            
            this.data[i * stride] = Math.floor(color.r * 255);
            this.data[i * stride + 1] = Math.floor(color.g * 255);
            this.data[i * stride + 2] = Math.floor(color.b * 255);
            this.data[i * stride + 3] = 255;
        }

        this.texture.needsUpdate = true;
    }
    
    _generateTexture(colors)
    {
        const width = this.samplesCount;
        const height = 1;
        
        this.data = new Uint8Array(4 * this.samplesCount);
        this.texture = new THREE.DataTexture(this.data, width, height);
    }
    
}

class World
{
    
    constructor(container)
    {
        this.initRenderer(container);
        this.initSceneElements(container);
        this.initGUI();

        currentAttractor = new attractors.AttractorsPrototypes[0];
        currentAttractor.init();
        this.regenerateAttractor();
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
        restartBtn.addEventListener('click', () =>
        {
            const MaxAttempts = 10000;
                
            for(let i = 0; i < MaxAttempts; i++)
            {
                currentAttractor.generateWeights();
                let L = attractors.calculateLyapunovExponent(currentAttractor);
                console.log(L);
                if(L > 0.3 && L < 10.0)
                {
                    break;
                }
            }
            
            this.regenerateAttractor();

            colormap.generateColors(THREE.MathUtils.randFloat(40, 70),
                                    THREE.MathUtils.randFloat(40, 70),
                                    THREE.MathUtils.randFloat(0, 360),
                                    THREE.MathUtils.randFloat(0, 360));            
        });
    }

    setAttractor(Prototype)
    {
        currentAttractor.clear();
        currentAttractor = new Prototype();
        currentAttractor.init();

        this.regenerateAttractor();

    }
    
    regenerateAttractor()
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

        controls.update();
        renderer.render(scene, camera);
    }
}

export { World };
