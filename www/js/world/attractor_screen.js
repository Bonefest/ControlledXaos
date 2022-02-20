import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import * as world from './world.js';

class AttractorScreen
{
    constructor(world)
    {
        this.world = world;
        
        let btn = document.getElementById('attractor-btn');

        btn.addEventListener('click', () =>
        {
            this.onClick(btn);
        });        
    }

    onClick(btn)
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
        let html =
`
<div class="container-fluid p-0 vh-100 overflow-auto" style="background-color: rgba(255, 255, 255, 0.1);">
  <div class="accordion accordion-flush" id="attractor-settings">

    <div class="accordion-item standard-list-item">

      <h2 class="accordion-header" id="head_one">
        <button class="accordion-button collapsed standard-list-header" type="button" data-bs-toggle="collapse" data-bs-target="#flush-one" aria-expanded="false" aria-controls="flush-one">
          Attractor settings
        </button>

      </h2>

      <div id="flush-one" class="accordion-collapse collapse" aria-labelledby="head_one" data-bs-parent="#attractor-settings">
        <div class="card bg-dark text-white">
          <div class="row g-0">
            <div class="col-12">
              <div class="card-body">
                <p class="card-text">Input 1</p>
              </div>
            </div>
          </div>
        </div>      
      </div>
    </div>
  </div>

  <div class="accordion accordion-flush" id="attractors-classes">

    <div class="accordion-item standard-list-item">

      <h2 class="accordion-header" id="head_two">
        <button class="accordion-button collapsed standard-list-header" type="button" data-bs-toggle="collapse" data-bs-target="#flush-two" aria-expanded="false" aria-controls="flush-two">
          Attractor classes
        </button>

      </h2>

      <div id="flush-two" class="accordion-collapse collapse" aria-labelledby="head_two" data-bs-parent="#attractors-classes">
`;
        attractors.AttractorsPrototypes.forEach((Prototype, i) =>
        {
            html += Prototype.getDescriptionHTML();
        });

        html +=
`
      </div>
    </div>
  </div>

</div>
`;
        htmlScreen.innerHTML = html;


        attractors.AttractorsPrototypes.forEach((Prototype, i) =>
        {
            let btn = document.getElementById(Prototype.getID());
            btn.addEventListener('click', () =>
            {
                this.world.setAttractor(Prototype);
                this.removeUI();
            });  
        });
        
    }

    removeUI()
    {
        let btn = document.getElementById('attractor-btn');
        btn.classList.toggle('active', false);
        
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {AttractorScreen};
