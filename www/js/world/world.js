import * as attractors from './attractor.js'

let pane;
let camera;
let scene;
let renderer;
let currentAttractor = new attractors.ChaosAttractor();

class World
{
    constructor(container)
    {
        this.render = this.render.bind(this);
        
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;
        
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.append(renderer.domElement);
        
        pane = new Tweakpane.Pane();
        const attractorsFolder = pane.addFolder({'title': 'Attractors list'});
        const polynom6Btn = attractorsFolder.addButton({title: 'Polynom6 Attractor'});
        polynom6Btn.on('click', () =>
        {
            currentAttractor.onRemoved(pane);
            currentAttractor = new attractors.Polynom6();
            currentAttractor.onCreated(pane);
        });

        const regenerateBtn = attractorsFolder.addButton({title: 'Regenerate'});
        regenerateBtn.on('click', () =>
        {
            this.regenerateAttractor();
        });
    }

    regenerateAttractor()
    {
        scene.remove.apply(scene, scene.children);

        const vertices = [];

        let state = new THREE.Vector3();
        for(let i = 0; i < 10000; i++)
        {
            state = currentAttractor.generateState(state);
            vertices.push(state.x * 10, state.y * 10, -30.0);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
        material.size = 0.1;
        
        const points = new THREE.Points(geometry, material);

        scene.add(points);
    }
        
    render()
    {
        requestAnimationFrame(this.render);
        renderer.render(scene, camera);
    }
}

export { World };
