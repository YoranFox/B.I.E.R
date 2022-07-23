import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IRobot } from '../models/robot';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public $robots: Observable<IRobot[]>;

  constructor(private readonly apiService: ApiService) {}
  ngOnInit(): void {
    this.getAllRobots();
  }

  public getAllRobots() {
    console.log('fetching all robots');

    this.$robots = this.apiService.fetchRobots();
  }

  public activateRobot(id: string) {
    this.apiService.activateRobot(id).subscribe((res) => {
      this.getAllRobots();
    });
  }

  public shutdownRobot(id: string) {
    this.apiService.shutdownRobot(id).subscribe((res) => {
      this.getAllRobots();
    });
  }
}
