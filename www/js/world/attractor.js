import * as THREE from '../vendor/three.js';
// TODO: class PolynomN - attractor, which allows to use polynoms on any order
class HenonAttractor
{
    init(gui)
    {
        this.folder = gui.addFolder({ 'title': 'Henon attractor settings'});
    }

    clear(gui)
    {
        gui.remove(this.folder);
    }
    
    generateWeights()
    {

    }
    
    generateState(ps)
    {
        return new THREE.Vector3(1 + -1.4 * ps.x * ps.x + 0.3 * ps.y, ps.x, 0.0);
    }
    
    static getName() { return "Henon Attractor"; }    
};

class PlaneAttractor
{
    init(gui)
    {
        this.generateWeights();
        
        this.folder = gui.addFolder({ 'title': 'Plane attractor settings'});
        for(let i = 1; i < 13; i++)
        {
            this.folder.addInput(this, 'a' + i, {min: -2.0, max: 2.0});
        }
    }

    clear(gui)
    {
        gui.remove(this.folder);
    }
    
    generateWeights()
    {
        for(let i = 0; i < 13; i++)
        {
            this['a' + i] = THREE.MathUtils.randFloat(-2.0, 2.0);
        }
    }
    
    generateState(ps)
    {
        return new THREE.Vector3(this.a1 + this.a2 * ps.x + this.a3 * ps.x * ps.x + this.a4 * ps.x * ps.y + this.a5 * ps.y + this.a6 * ps.y * ps.y,
                                 this.a7 + this.a8 * ps.x + this.a9 * ps.x * ps.x + this.a10 * ps.x * ps.y + this.a11 * ps.y + this.a12 * ps.y * ps.y,
                                 0);
    }
    
    static getName() { return "Plane Attractor"; }    
};

function createPolynomNAttractor(order)
{
    return class
    {
        init(gui)
        {
            this.generateWeights();
            
            this.folder = gui.addFolder({ 'title' : 'Polynom' + order +' attractor settings'});
            
            let coeffsCount = this.getCoeffsCount();
            for(let i = 0; i < coeffsCount; i++)
            {
                this.folder.addInput(this, 'a' + i, {min: -1.5, max: 1.5});
            }
        }

        clear(gui)
        {
            gui.remove(this.folder);
        }
        
        generateWeights()
        {
            let coeffsCount = this.getCoeffsCount();
            
            for(let i = 0; i < coeffsCount; i++)
            {
                this['a' + i] = THREE.MathUtils.randFloat(-1.5, 1.5);
            }
        }

        getCoeffsCount()
        {
            return (((order + 1) * (order + 2) * (order + 3)) / 2);
        }

        generateState(ps)
        {
            let ns = new THREE.Vector3(0, 0, 0);
            
            let coeffIdx = 0;
            for(let zp = 0; zp < order; zp++)
            {
                let z = Math.pow(ps.z, zp);
                for(let yp = 0; yp <= order - zp; yp++)
                {
                    let y = Math.pow(ps.y, yp);
                    for(let xp = 0; xp <= order - yp - zp; xp++)
                    {
                        let x = Math.pow(ps.x, xp);
                        let xyz = x * y * z;
                        
                        ns.x += this['a' + coeffIdx] * xyz;
                        ns.y += this['a' + (coeffIdx + 1)] * xyz;
                        ns.z += this['a' + (coeffIdx + 2)] * xyz;
                        
                        coeffIdx += 3;
                    }
                }
            }

            return ns;
        }
        
        static getName() { return "Polynom" + order + " Attractor"; }
    };

}


let Polynom2Attractor = createPolynomNAttractor(2);
let Polynom3Attractor = createPolynomNAttractor(3);
let Polynom4Attractor = createPolynomNAttractor(4);
let Polynom5Attractor = createPolynomNAttractor(5);
let Polynom6Attractor = createPolynomNAttractor(6);
let Polynom7Attractor = createPolynomNAttractor(7);


export function calculateLyapunovExponent(attractor)
{
    const PreparationSteps = 500;
    const CalculationSteps = 1000;
    
    let state0 = new THREE.Vector3(0, 0, 0);
    for(let i = 0; i < PreparationSteps; i++)
    {
        state0 = attractor.generateState(state0);
    }
    
    let state1 = state0.clone().add(new THREE.Vector3(0.001, 0.001, 0.0));

    let d0Sep = 0.0001;
    let L = 0;
    for(let i = 0; i < CalculationSteps; i++)
    {
        state0 = attractor.generateState(state0); // Move first orbit
        state1 = attractor.generateState(state1); // Move second orbit

        const limit = 2;
        
        if(i > 100 && (Math.abs(state0.x) > limit || Math.abs(state0.y) > limit || Math.abs(state0.z) > limit || Math.abs(state1.x) > limit || Math.abs(state1.y) > limit || Math.abs(state1.z) > limit))
        {
            return -1.0;
        }
        
        let sepDir = state1.clone()                // Calculate separation vector from 1st orbit to the 2nd
        sepDir.sub(state0);
        
        let d1Sep = sepDir.length();               // Calculate separation length
        sepDir.multiplyScalar(d0Sep / d1Sep);      // Normalize, then multiply by length of previous sep
        state0.add(sepDir);                        // Readjust first orbit, so its separation length
                                                   // is equal to previous separation
        
        L += Math.log2(d1Sep / d0Sep);
    }

    return L / CalculationSteps;
}

const AttractorsPrototypes = [
    HenonAttractor,
    PlaneAttractor,
    Polynom2Attractor,
    Polynom3Attractor,    
    Polynom4Attractor,
    Polynom5Attractor,
    Polynom6Attractor,
    Polynom7Attractor,        
];

export { AttractorsPrototypes };
