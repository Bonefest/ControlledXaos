import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import * as world from './world.js';

class FavouritesScreen
{
    constructor(world)
    {
        this.world = world;
        
        let btn = document.getElementById('favourites-btn');

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
        db.allDocs({ include_docs: true}, function(err, attractors)
        {
            if(!err)
            {
                let htmlScreen = document.getElementById('screen');
                let html = '';

                console.log(attractors);
                
                html=`
<div class="container-fluid p-0 vh-100 overflow-auto" style="background-color: rgba(255, 255, 255, 0.1);">
`;                

                for(let i = 0; i < attractors["total_rows"]; i++)
                {
                    let date = new Date(attractors["rows"][i]["doc"]["_id"]);
                    let attractorData = JSON.parse(attractors["rows"][i]["doc"]["attractor_data"]);
                    let minutesStr = date.getMinutes().toString();
                    if(minutesStr.length == 1)
                    {
                        minutesStr = '0' + minutesStr;
                    }
                    
                    html+=`
<div class="row pt-4">
  <div class="col-10 offset-1">

    <div class="card bg-dark text-white rounded-0 shadow-lg">

      <div class="card-header text-right">
        <div class="row">
          <div class="col-10">
            <div class="row">
              <b>${attractorData["type"]}</b>
            </div>

            <div class="row">
              <div style="color: rgb(192, 192, 192);">${date.getHours()}:${minutesStr} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}</div>
            </div>
          </div>

          <div class="col-2">
            <button type="button" class="btn btn-dark btn-sm""><i class="fas fa-trash fa-2x" style="color: #881919"></i></button>
          </div>

        </div>
      </div>


      <img src="img/henon.jpeg" class="card-img-top rounded-0" style="height: 160px; object-fit: cover;">

      <div class="card-body">
        <div class="row">
          <div class="col-10">
            <div class="row pb-0">
              <h5>${attractors["rows"][i]["doc"]["name"]}</h5>
            </div>

            <div class="row pt-0 mt-0">
              <div style="color: rgb(192, 192, 192)">Views: 11</div>
            </div>
          </div>

          <div class="col-2">
           <button type="button" class="btn btn-dark btn-sm"><i class="fas fa-pencil-alt"></i></button>
          </div>
        </div>

        <div class="row">
        </div>

      </div>

    </div>

    <div class="card-footer d-grid p-0 m-0">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-light rounded-0">View</button>
      </div>
    </div>

  </div>

</div>
`;
                }

                htmlScreen.innerHTML = html;                
            }
        });
        

        
    }

    removeUI()
    {
        let btn = document.getElementById('favourites-btn');
        btn.classList.toggle('active', false);
        
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {FavouritesScreen};
