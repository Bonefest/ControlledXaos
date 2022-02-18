import * as THREE from '../vendor/three.js';

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

export { Colormap };
