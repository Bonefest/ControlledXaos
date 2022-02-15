import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';

import { OrbitControls } from '../vendor/OrbitControls.js';

let GUI;
let scene;
let camera;
let controls;
let renderer;
let currentAttractor;
let visualizationClock;

let pointsBufferSize = { BufferSize: 50000 };
let pointsMultiplier = new THREE.Vector3(10, 10, 10);

class World
{
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
    }

    initGUI()
    {
        GUI = new Tweakpane.Pane();
        GUI.hidden = true;
        const visualizationFolder = GUI.addFolder({'title': 'Visualization settings'});
        visualizationFolder.addInput(pointsMultiplier, 'x', { min: 0.01, max: 100.0 });
        visualizationFolder.addInput(pointsMultiplier, 'y', { min: 0.01, max: 100.0 });
        visualizationFolder.addInput(pointsMultiplier, 'z', { min: 0.01, max: 100.0 });
        visualizationFolder.addInput(pointsBufferSize, 'BufferSize', { min: 100, max: 50000});
        
        const attractorsFolder = GUI.addFolder({'title': 'Attractors list'});

        const restartBtn = attractorsFolder.addButton({title: 'Restart'});
        restartBtn.on('click', () =>
        {
            this.regenerateAttractor();
        });

        const regenerateBtn = attractorsFolder.addButton({title: 'Regenerate'});
        regenerateBtn.on('click', () =>
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
        });
        
        attractors.AttractorsPrototypes.forEach((Prototype, i) =>
        {
            const attractorBtn = attractorsFolder.addButton({title: Prototype.getName()});
            attractorBtn.on('click', () =>
            {
                currentAttractor.clear(GUI);
                currentAttractor = new Prototype();
                currentAttractor.init(GUI);

                this.regenerateAttractor();
            });
        });

    }
    
    constructor(container)
    {
        this.initRenderer(container);
        this.initSceneElements(container);
        this.initGUI();

        currentAttractor = new attractors.AttractorsPrototypes[0];
        currentAttractor.init(GUI);
        this.regenerateAttractor();
    }
    
    regenerateAttractor()
    {
        scene.remove.apply(scene, scene.children);
        visualizationClock.start();
        
        const vertices = [];

        let state = new THREE.Vector3();
        for(let i = 0; i < pointsBufferSize.BufferSize; i++)
        {
            state = currentAttractor.generateState(state);
            vertices.push(state.x * pointsMultiplier.x, state.y * pointsMultiplier.y, state.z * pointsMultiplier.z);
        }

        const material = new THREE.ShaderMaterial({

            uniforms:
            {
                time: { value: 0.0 },
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
