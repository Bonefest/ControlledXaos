import * as THREE from '../vendor/three.js';

const questionIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z"></path>
</svg>`;

const CalculationSpeed =
{
    ExtremelyFast: 0,
    Fast: 1,
    RelativelyFast: 2,
    RelativelySlow: 3,
    Slow: 4,
    ExtremelySlow: 5
};

function generateSpeedDescription(speed)
{
    switch(speed)
    {
        case CalculationSpeed.ExtremelyFast: return `<span style="color: rgb(143, 215, 219);"> extremely fast </span> (up to 10 seconds)`;                        
        case CalculationSpeed.Fast: return `<span style="color: rgb(39, 151, 135);"> fast </span> (10-60 seconds)`;
        case CalculationSpeed.RelativelyFast: return `<span style="color: rgb(238, 122, 52);"> relatively fast </span> (1-10 minutes)`;
        case CalculationSpeed.RelativelySlow: return `<span style="color: rgb(238, 122, 52);"> relatively slow </span> (10-30 minutes)`;        
        case CalculationSpeed.Slow: return `<span style="color: rgb(238, 122, 52);"> slow </span> (30-60 minutes)`;
        case CalculationSpeed.ExtremelySlow: return `<span style="color: green;"> extremely slow </span> (1 hour+)`;
    }
}

function generateTemplate(imgSrc, title, description, btnID, speed, dims)
{
    let speedDesc = generateSpeedDescription(speed);
    
    return `
<div class="card bg-dark text-white pt-4">
  <div class="row g-0">
    <div class="col-2">
      <img src="${imgSrc}" class="img-fluid rounded-start" style="height: 100%; object-fit: cover;">
    </div>

    <div class="col-10">
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${questionIcon} ${description}<i class="bi-quote"></i></p>
        <p class="card-text additional-info p-0 m-0">Calculation speed: ${speedDesc}</p>
        <p class="card-text additional-info">Dimensions: ${dims}</p>
        <row class="d-grid">
          <button type="button" class="btn btn-light btn-lg rounded-0" id="${btnID}">Visualize</button>
        </row>
      </div>
    </div>
  </div>
</div>
`;
}

class HenonAttractor
{
    init()
    {
        this.json = {};
        this.json.type = HenonAttractor.getID();        
        this.json.w = new Array(3);
        this.json.w[0] = 1;
        this.json.w[1] = -1.4;
        this.json.w[2] = 0.3        
    }

    clear()
    {

    }
    
    generateWeights()
    {

    }
    
    generateState(ps)
    {
        return new THREE.Vector3(this.json.w[0] + this.json.w[1] * ps.x * ps.x + this.json.w[2] * ps.y, ps.x, 0.0);
    }

    static getID()
    {
        return "Henon";
    }

    static getName() { return "Henon Attractor"; }    

    static getImgPath() { return "img/henon.jpeg"; }
    
    static getDescriptionHTML()
    {
        return generateTemplate(HenonAttractor.getImgPath(), HenonAttractor.getName(), "The Hénon map, sometimes called Hénon-Pomeau attractor/map, is a discrete-time dynamical system. It is one of the most studied examples of dynamical systems that exhibit chaotic behavior. The Hénon map takes a point (xn, yn) in the plane and maps it to a new point.", HenonAttractor.getID(), CalculationSpeed.ExtremelyFast, "2D");
    }
};

class PlaneAttractor
{
    init()
    {
        this.json = {};
        this.json.type = PlaneAttractor.getID();
        this.json.w = new Array(13);
    }

    clear()
    {

    }
    
    generateWeights()
    {
        for(let i = 0; i < 13; i++)
        {
            this.json.w[i] = THREE.MathUtils.randFloat(-2.0, 2.0);
        }
    }
    
    generateState(ps)
    {
        return new THREE.Vector3(this.json.w[0] + this.json.w[1] * ps.x + this.json.w[2] * ps.x * ps.x + this.json.w[3] * ps.x * ps.y + this.json.w[4] * ps.y + this.json.w[5] * ps.y * ps.y,
                                 this.json.w[6] + this.json.w[7] * ps.x + this.json.w[8] * ps.x * ps.x + this.json.w[9] * ps.x * ps.y + this.json.w[10] * ps.y + this.json.w[11] * ps.y * ps.y,
                                 0);
    }

    static getID()
    {
        return "Plane";
    }

    static getName() { return "Plane Attractor"; }    

    static getImgPath() { return "img/plane.jpeg"; }
    
    static getDescriptionHTML()
    {
        return generateTemplate(PlaneAttractor.getImgPath(), PlaneAttractor.getName(), "Plane attractor is a simplified version of the 2nd-order polynom, where z coordinate is always equal 1. It's suitable for users that are not interested in volumetric attractors.", PlaneAttractor.getID(), CalculationSpeed.Fast, "2D");
    }

};

function createPolynomNAttractor(order)
{
    const type = `Polynom${order}`;
    const name = `Polynom${order} Attractor`;
    const imgPath = `img/polynom${order}.jpeg`;
    
    return class
    {
        init()
        {
            let coeffsCount = this.getCoeffsCount();

            this.json = {};
            this.json.type = type;
            this.json.w = new Array(coeffsCount);
        }

        clear()
        {

        }
        
        generateWeights()
        {
            for(let i = 0; i < this.json.w.length; i++)
            {
                this.json.w[i] = THREE.MathUtils.randFloat(-1.5, 1.5);
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
                        
                        ns.x += this.json.w[coeffIdx] * xyz;
                        ns.y += this.json.w[coeffIdx + 1] * xyz;
                        ns.z += this.json.w[coeffIdx + 2] * xyz;
                        
                        coeffIdx += 3;
                    }
                }
            }

            return ns;
        }

        static getID()
        {
            return type;
        }

        static getImgPath()
        {
            return imgPath;
        }
        
        static getDescriptionHTML()
        {
            return generateTemplate(imgPath, name, `General ${order}-order attractor, meaning that each of its coordinates is calculated as a polynom of ${order} order. Choosing coefficients can be a slow process. Consider using Plane Attractor if you need to get results faster.`, type, CalculationSpeed.Slow, "3D");
        }
        
        static getName() { return name; }
    };

}


let Polynom2Attractor = createPolynomNAttractor(2);
let Polynom3Attractor = createPolynomNAttractor(3);
let Polynom4Attractor = createPolynomNAttractor(4);
let Polynom5Attractor = createPolynomNAttractor(5);
let Polynom6Attractor = createPolynomNAttractor(6);
let Polynom7Attractor = createPolynomNAttractor(7);


export function calculateLyapunovExponent(attractor, config)
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

        const limit = config.pointSizeLimit;
        
        if(i > 100 && (Math.abs(state0.x) > limit || Math.abs(state0.y) > limit || Math.abs(state0.z) > limit || Math.abs(state1.x) > limit || Math.abs(state1.y) > limit || Math.abs(state1.z) > limit || (L / i) < 0.0))
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

const AttractorsPrototypes = new Map([
    [HenonAttractor.getID(), HenonAttractor],
    [PlaneAttractor.getID(), PlaneAttractor],
    [Polynom2Attractor.getID(), Polynom2Attractor],
    [Polynom3Attractor.getID(), Polynom3Attractor],
    [Polynom4Attractor.getID(), Polynom4Attractor],
    [Polynom5Attractor.getID(), Polynom5Attractor],
    [Polynom6Attractor.getID(), Polynom6Attractor],
    [Polynom7Attractor.getID(), Polynom7Attractor]
]);

export { AttractorsPrototypes };
