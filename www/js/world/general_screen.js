import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import * as world from './world.js';

class GeneralScreen
{
    constructor(world)
    {
        this.world = world;
        let btn = document.getElementById('general-btn');
        let btBtn = new bootstrap.Button(btn);
        btn.addEventListener('click', () =>
        {
            this.onClick(this, btn);
        });        
    }

    onClick(owner, btn)
    {
        btn.classList.toggle('active');        
        let toggled = btn.classList.contains('active');        

        if(toggled)
        {
            this.addUI(owner);
        }
        else
        {
            this.removeUI();
        }
    }

    addUI(owner)
    {
        // Generation parameters
        // 1. Lyapunov range
        // 2. Number of searching iterations
        // 3. Native point limit size
        //
        // Visualizatiom parameters
        // 1. Point size
        // 2. Points multiplier (+ auto-correction checkbox)
        // 3. Number of points
        //
        // Camera parameters
        // 1. Camera position
        // 2. Camera direction
        // 3. Reset camera
        // 4. Camera controller type selector
        //
        // Colormap parameters
        // 1. Series count range
        // 2. Regenerate colormap

        let config = this.world.getConfig();
        
        let htmlScreen = document.getElementById('screen');
        let html = `
<div class="container-fluid p-0 vh-100 overflow-auto" style="background-color: rgba(255, 255, 255, 0.1);">
   <div class="card bg-dark text-white rounded-0 mt-4 px-3">
     <h6 class="py-2"><b>Generation parameters</b></h6>
    
     <label for="lyapunov-max-range" class="form-label">Lyapunov max value</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 class="lyapunov-max-range" id="lyapunov-max-range-label">${config.lyapunovMaxRange}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.5" max="10000.0" value="${config.lyapunovMaxRange}" id="lyapunov-max-range">
       </div>
     </div>

     <label for="lyapunov-min-range" class="form-label">Lyapunov min value</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="lyapunov-min-range-label">${config.lyapunovMinRange}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.01" max="100.0" step="0.01" value="${config.lyapunovMinRange}" id="lyapunov-min-range">
       </div>
     </div>

     <label for="lyapunov-size-limit-range" class="form-label">Point size limit</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="point-size-limit-range-label">${config.pointSizeLimit}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.1" max="100.0" value="${config.pointSizeLimit}" id="point-size-limit-range">
       </div>
     </div>

     <label for="searching-iterations-range" class="form-label">Number of searching iterations</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="searching-iterations-range-label">${config.searchingIterationsCount}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="100" max="10000" value="${config.searchingIterationsCount}" id="searching-iterations-range">
       </div>
     </div>

   </div>




   <div class="card bg-dark text-white rounded-0 mt-4 px-3">
     <h6 class="py-2"><b>Visualization parameters</b></h6>
    
     <label for="point-size" class="form-label">Point size</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="point-size-label">${config.maxPointSize}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="10.0" max="1000.0" value="${config.maxPointSize}" id="point-size">
       </div>
     </div>

     <label for="points-multiplier" class="form-label">Points multiplier</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="points-multiplier-label">${config.pointsMultiplier}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.01" max="100.0" value="${config.pointsMultiplier}" id="points-multiplier">
       </div>
     </div>

     <label for="points-number" class="form-label">Number of points</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="points-number-label">${config.maxPoints}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="20000" max="500000" value="${config.maxPoints}" id="points-number">
       </div>
     </div>

     <label for="time-speed" class="form-label">Time speed</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="time-speed-label">${config.timeSpeed}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.1" max="10.0" value="${config.timeSpeed}" id="time-speed">
       </div>
     </div>

     <div class="row d-grid">
       <button type="button" class="btn btn-warning" id="btn-recalculate-att">Recalculate attractor</button>
     </div>

   </div>




   <div class="card bg-dark text-white rounded-0 mt-4 px-3">
     <h6 class="py-2"><b>Colormap parameters</b></h6>
    
     <label for="color-series-max-range" class="form-label">Maximal number of colors</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="color-series-max-range-label">${config.colormapSeriesMaxRange}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="3" max="32" value="${config.colormapSeriesMaxRange}" id="color-series-max-range">
       </div>
     </div>

     <label for="color-series-min-range" class="form-label">Minimal number of colors</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="color-series-min-range-label">${config.colormapSeriesMinRange}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="3" max="32" value="${config.colormapSeriesMinRange}" id="color-series-min-range">
       </div>
     </div>

     <label for="color-randomness" class="form-label">Color distribution randomness, %</label>
     <div class="row g-0">
       <div class="col-3 text-center">
         <h6 id="color-randomness-label">${config.colormapColorRandomness * 100}</h6>
       </div>
       <div class="col-9">
         <input type="range" class="form-range" min="0.0" max="100.0" value="${config.colormapColorRandomness * 100}" id="color-randomness">
       </div>
     </div>

     <div class="row d-grid">
       <button type="button" class="btn btn-warning" id="btn-new-color">New color</button>
     </div>

   </div>

   <div style="height: 800px;"></div>

</div>
`;
        htmlScreen.innerHTML = html;

        let addRangeListener = function(elementId, callback)
        {
            let range = document.getElementById(elementId);
            range.addEventListener('input', function(v)
            {
                let rangeLabel = document.getElementById(`${elementId}-label`);
                rangeLabel.innerHTML = `${v.target.value}`;

                callback(v);
            });
        };

        addRangeListener('lyapunov-max-range', function(v)
        {
            config.lyapunovMaxRange = v.target.value;
        });
        
        addRangeListener('lyapunov-min-range', function(v)
        {
            config.lyapunovMinRange = v.target.value;
        });
        
        addRangeListener('point-size-limit-range', function(v)
        {
            config.pointSizeLimit = v.target.value;
        });
        
        addRangeListener('searching-iterations-range', function(v)
        {
            config.searchingIterationsCount = v.target.value;
        });

        addRangeListener('point-size', function(v)
        {
            config.maxPointSize = v.target.value;
        });

        addRangeListener('points-multiplier', function(v)
        {
            config.pointsMultiplier = v.target.value;
        });

        addRangeListener('points-number', function(v)
        {
            config.maxPoints = v.target.value;
        });

        addRangeListener('time-speed', function(v)
        {
            config.timeSpeed = v.target.value;
        });        

        addRangeListener('color-series-max-range', function(v)
        {
            config.colormapSeriesMaxRange = v.target.value;
        });        

        addRangeListener('color-series-min-range', function(v)
        {
            config.colormapSeriesMinRange = v.target.value;
        });

        addRangeListener('color-randomness', function(v)
        {
            config.colormapColorRandomness = v.target.value / 100.0;
        });                

        let recalculateAttBtn = document.getElementById('btn-recalculate-att');
        recalculateAttBtn.addEventListener('click', function()
        {
            owner.world.calculateAttractor();
        });
        
        let newClrBtn = document.getElementById('btn-new-color');
        newClrBtn.addEventListener('click', function()
        {
            owner.world.generateRandomColor();
        });

    }

    removeUI()
    {
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {GeneralScreen};
