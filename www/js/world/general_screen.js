import * as THREE from '../vendor/three.js';
import * as attractors from './attractor.js';
import * as world from './world.js';

class GeneralScreen
{
    constructor(world)
    {
        let btn = document.getElementById('general-btn');
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
        htmlScreen.innerHTML = '<p>General Screen</p>';
    }

    removeUI()
    {
        let htmlScreen = document.getElementById('screen');
        htmlScreen.innerHTML = '';
    }
}

export {GeneralScreen};
