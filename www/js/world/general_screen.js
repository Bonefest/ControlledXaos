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
        <input type="range" class="form-range" min="0.5" max="10000.0" value="${config.lyapunovMinRange}" id="lyapunov-min-range">
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

    <div class="d-grid mb-2">
      <button type="button" class="btn btn-light">Reset to default</button>
    </div>
  </div>
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

    }

    removeUI()
    {
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {GeneralScreen};
