import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './animations/route-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // <-- add your animations here
    slider,
  ],
})
export class AppComponent {
  title = 'client';

  constructor() {
    function setDocHeight() {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
      };
      
      window.addEventListener('resize', function () {
      setDocHeight();
      });
      window.addEventListener('orientationchange', function () {
      setDocHeight();
      });
      
      setDocHeight();
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
