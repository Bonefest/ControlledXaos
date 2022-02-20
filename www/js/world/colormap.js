import * as THREE from '../vendor/three.js';

class Colormap
{
    constructor(samplesCount)
    {
        this.json = {};
        this.json.samplesCount = samplesCount;
        this._generateTexture();
    }

    loadFromJson(json)
    {
        this.json.samplesCount = json.samplesCount;
        
        for(let i = 0; i < this.json.data.length; i++)
        {
            this.json.data[i] = json.data[i];
        }

        this.texture.needsUpdate = true;
    }
    
    setColors(colors)
    {
        this._updateData(colors);
    }

    generateColorsHSLRandom()
    {
        this.generateColorsHSL(THREE.MathUtils.randFloat(40, 70),
                               THREE.MathUtils.randFloat(40, 70),
                               THREE.MathUtils.randFloat(0, 360),
                               THREE.MathUtils.randFloat(0, 360));
    }
    
    generateColorsHSL(startL, endL, startH, endH)
    {
        let colors = new Array();

        for(let i = 0; i < this.json.samplesCount; i++)
        {
            let t = i / this.json.samplesCount;
            let l = (1 - t) * startL + t * endL;
            let h = (1 - t) * startH + t * endH;
            
            colors.push(new THREE.Color().setHSL(h / 360.0, 0.5, l / 100.0));
        }

        this._updateData(colors);
    }

    generateColorRGBSeriesRandom(seriesCount)
    {
        let series = new Array(seriesCount * 4);
        let prevT = 0.0;
        for(let i = 0; i < seriesCount; i++)
        {
            series[i * 4] = THREE.MathUtils.randFloat(0, 1);
            series[i * 4 + 1] = THREE.MathUtils.randFloat(0, 1);
            series[i * 4 + 2] = THREE.MathUtils.randFloat(0, 1);
            series[i * 4 + 3] = THREE.MathUtils.randFloat(prevT, 1);

            prevT = series[i * 4 + 3];
        }

        series[(seriesCount - 1) * 4 + 3] = 1.0;

        let colors = new Array();
        
        for(let i = 0; i < this.json.samplesCount; i++)
        {
            let t = i / this.json.samplesCount;
            
            let s = 1;
            while(series[s * 4 + 3] < t && s < seriesCount - 1)
            {
                s++;
            }

            let st = THREE.MathUtils.clamp((t - series[(s - 1) * 4 + 3]) / (series[s * 4 + 3] - series[(s - 1) * 4 + 3]), 0.0, 1.0);
            
            let r = (1 - st) * series[(s - 1) * 4] + st * series[s * 4];
            let g = (1 - st) * series[(s - 1) * 4 + 1] + st * series[s * 4 + 1];
            let b = (1 - st) * series[(s - 1) * 4 + 2] + st * series[s * 4 + 2];            
            
            colors.push(new THREE.Color().setRGB(r, g, b));            
        }

        this._updateData(colors);        
    }
    
    generateColorsRGBRandom()
    {
        this.generateColorsRGB(THREE.MathUtils.randFloat(0, 1),
                               THREE.MathUtils.randFloat(0, 1),
                               THREE.MathUtils.randFloat(0, 1),
                               THREE.MathUtils.randFloat(0, 1),
                               THREE.MathUtils.randFloat(0, 1),
                               THREE.MathUtils.randFloat(0, 1));            

    }
    
    generateColorsRGB(startR, endR, startG, endG, startB, endB)
    {
        let colors = new Array();

        for(let i = 0; i < this.json.samplesCount; i++)
        {
            let t = i / this.json.samplesCount;
            let r = (1 - t) * startR + t * endR;
            let g = (1 - t) * startG + t * endG;
            let b = (1 - t) * startB + t * endB;

            colors.push(new THREE.Color().setRGB(r, g, b));
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
            
            this.json.data[i * stride] = Math.floor(color.r * 255);
            this.json.data[i * stride + 1] = Math.floor(color.g * 255);
            this.json.data[i * stride + 2] = Math.floor(color.b * 255);
            this.json.data[i * stride + 3] = 255;
        }

        this.texture.needsUpdate = true;
    }
    
    _generateTexture()
    {
        const width = this.json.samplesCount;
        const height = 1;

        this.json.data = new Uint8Array(4 * this.json.samplesCount);
        this.texture = new THREE.DataTexture(this.json.data, width, height);
    }
    
}

export { Colormap };
