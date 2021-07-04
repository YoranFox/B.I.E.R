import { Component, OnInit } from '@angular/core';
import flv from 'flv.js';

@Component({
  selector: 'app-live-cam',
  templateUrl: './live-cam.component.html',
  styleUrls: ['./live-cam.component.scss']
})
export class LiveCamComponent implements OnInit {

  flvPlayer: flv.Player | undefined;

  constructor() { }

  ngOnInit(): void {
    if (flv.isSupported()) {
        var videoElement = <HTMLAudioElement>document.getElementById('videoElement');
        this.flvPlayer = flv.createPlayer({
            type: 'flv',
            isLive: true,
            url: 'http://192.168.1.9:8000/live/test.flv'
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        
    }
  }

  play(){
    if(this.flvPlayer)
      this.flvPlayer.play();
  }

}
