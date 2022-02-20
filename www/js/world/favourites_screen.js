import * as THREE from '../vendor/three.js';
import {AttractorsPrototypes} from './attractor.js';
import * as world from './world.js';

class FavouritesScreen
{
    constructor(world)
    {
        this.world = world;
        
        let btn = document.getElementById('favourites-btn');

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
                    let attractorJson = JSON.parse(attractors["rows"][i]["doc"]["attractor_data"]);
                    let minutesStr = date.getMinutes().toString();
                    let imgSrc = AttractorsPrototypes.get(attractorJson["type"]).getImgPath();
                    
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
              <b>${attractorJson["type"]}</b>
            </div>

            <div class="row">
              <div style="color: rgb(192, 192, 192);">${date.getHours()}:${minutesStr} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}</div>
            </div>
          </div>

          <div class="col-2">
            <button type="button" class="btn btn-dark btn-sm""><i class="fas fa-trash fa-2x" style="color: #881919" id="trash-btn-${i}"></i></button>
          </div>

        </div>
      </div>


      <img src="${imgSrc}" class="card-img-top rounded-0" style="height: 160px; object-fit: cover; opacity: 0.75;">

      <div class="card-body pt-0">
        <div class="row">
          <div class="col-12">
            <div class="row py-0">
               <input type="text" class="form-control" value="${attractors["rows"][i]["doc"]["name"]}" style="background-color: transparent; border: none; color: #FFF; font-size: 20px;"></input>
            </div>

            <div class="row pt-0 mt-0">
              <div style="color: rgb(192, 192, 192)">This attractor was viewed 11 times</div>
            </div>
          </div>

        </div>

        <div class="row">
        </div>

      </div>

    </div>

    <div class="card-footer d-grid p-0 m-0">
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-light rounded-0" style="background-color: rgba(220, 220, 220, 1.0); border-width: 0px;" id="view-btn-${i}">View</button>
      </div>
    </div>

  </div>

</div>
`;
                }

                html += '</div> <div style="height:320px"></div>';
                htmlScreen.innerHTML = html;
                
                for(let i = 0; i < attractors["total_rows"]; i++)
                {
                    let viewBtn = document.getElementById(`view-btn-${i}`);
                    let trashBtn = document.getElementById(`trash-btn-${i}`);
                    
                    let attractorJson = JSON.parse(attractors["rows"][i]["doc"]["attractor_data"]);
                    
                    viewBtn.addEventListener('click', function()
                    {
                        owner.world.setAttractorFromJson(attractorJson, attractors["rows"][i]["doc"]["_id"]);
                        owner.removeUI();
                    });

                    trashBtn.addEventListener('click', function()
                    {
                        db.get(attractors["rows"][i]["doc"]["_id"], function(err, doc)
                        {
                            if(!err)
                            {
                                db.remove(doc);
                            }
                        });                                                  

                        owner.removeUI();
                    });
                }
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
