import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import * as world from './world.js';

class AttractorScreen
{
    constructor(world)
    {
        let btn = document.getElementById('attractor-btn');
        let btBtn = new bootstrap.Button(btn);
        btn.addEventListener('click', () =>
        {
            this.onClick(world, btn);
        });        
    }

    onClick(world, btn)
    {
        btn.classList.toggle('active');        
        let toggled = btn.classList.contains('active');        

        if(toggled)
        {
            this.addUI();
        }
        else
        {
            this.removeUI();
        }
    }

    addUI()
    {
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML =
`
<div class="container-fluid p-0 vh-100" style="background-color: rgba(255, 255, 255, 0.1);">
  <div class="accordion accordion-flush" id="attractors-classes">
    <div class="accordion-item standard-list-item">

      <h2 class="accordion-header" id="head_one">
        <button class="accordion-button collapsed standard-list-header" type="button" data-bs-toggle="collapse" data-bs-target="#flush-one" aria-expanded="false" aria-controls="flush-one">
          Attractors classes
        </button>
      </h2>

      <div id="flush-one" class="accordion-collapse collapse" aria-labelledby="head_one" data-bs-parent="#attractors-classes">
        <div class="accordion-body d-grid p-0">
          <button type="button" class="btn btn-dark rounded-0">Henon attractor</button>
          <button type="button" class="btn btn-dark rounded-0">Henon attractor</button>
        </div>
      </div>

    </div>
  </div>

</div>

`;
    }

    removeUI()
    {
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {AttractorScreen};
