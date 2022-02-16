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
<div class="container-fluid p-0 vh-100 overflow-auto" style="background-color: rgba(255, 255, 255, 0.1);">
  <div class="accordion accordion-flush" id="attractors-classes">

    <div class="accordion-item standard-list-item">

      <h2 class="accordion-header" id="head_one">
        <button class="accordion-button collapsed standard-list-header" type="button" data-bs-toggle="collapse" data-bs-target="#flush-one" aria-expanded="false" aria-controls="flush-one">
          Attractor classes
        </button>
      </h2>

      <div id="flush-one" class="accordion-collapse collapse" aria-labelledby="head_one" data-bs-parent="#attractors-classes">

        <div class="card bg-dark text-white">
          <div class="row g-0">
            <div class="col-2">
              <img src="img/henon.jpeg" class="img-fluid rounded-start" style="height: 100%">
            </div>

            <div class="col-10">
              <div class="card-body">
                <h5 class="card-title">Henon attractor</h5>
                <p class="card-text">
The Hénon map, sometimes called Hénon-Pomeau attractor/map, is a discrete-time dynamical system. It is one of the most studied examples of dynamical systems that exhibit chaotic behavior. The Hénon map takes a point (xn, yn) in the plane and maps it to a new point 
                </p>

                <button type="button" class="btn btn-light btn-lg">Visualize</button>
              </div>
            </div>
          </div>
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
