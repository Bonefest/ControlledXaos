class ChaosAttractor
{
    onCreated(gui) { }
    onRemoved(gui) { }
    generateWeights() { }
    generateState(ps) { }
    getName() { return "unknown"; }
};

class Polynom6 extends ChaosAttractor
{
    onCreated(gui)
    {
        this.generateWeights();

        const params =
        {
            a : this.a,
            b : this.b,
            c : this.c,
            d : this.d,
            e : this.e,
            f : this.f
        };
        
        this.folder = gui.addFolder({ 'title': 'Polynom6 settings'});
        this.folder.addInput(params, 'a', {min : -5.0, max : 5.0});
        this.folder.addInput(params, 'b', {min : -5.0, max : 5.0});
        this.folder.addInput(params, 'c', {min : -5.0, max : 5.0});
        this.folder.addInput(params, 'd', {min : -5.0, max : 5.0});
        this.folder.addInput(params, 'e', {min : -5.0, max : 5.0});
        this.folder.addInput(params, 'f', {min : -5.0, max : 5.0});        
    }

    onRemoved(gui)
    {
        gui.remove(this.folder);
    }
    
    generateWeights()
    {
        // this.a = THREE.MathUtils.randFloat(-5.0, 5.0);
        // this.b = THREE.MathUtils.randFloat(-5.0, 5.0);
        // this.c = THREE.MathUtils.randFloat(-5.0, 5.0);
        // this.d = THREE.MathUtils.randFloat(-5.0, 5.0);
        // this.e = THREE.MathUtils.randFloat(-5.0, 5.0);
        // this.f = THREE.MathUtils.randFloat(-5.0, 5.0);

        this.a = -1.4;
        this.c = 0.3;
        this.f = 1.0;
        this.b = 1.0;
        this.d = 0.0;
        this.e = 0.0;
    }
    
    generateState(ps)
    {
        return new THREE.Vector3(this.a * ps.x * ps.x + this.b + this.c * ps.y,
                                 this.d * ps.y * ps.y + this.e + this.f * ps.x);
    }
    
    getName() { return "Polynom6Attractor"; }    
};

export { ChaosAttractor, Polynom6 };
