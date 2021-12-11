import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Beverage } from 'src/app/_sdk/models';

@Component({
  selector: 'app-beverage-list-modal',
  templateUrl: './beverage-list-modal.component.html',
  styleUrls: ['./beverage-list-modal.component.scss']
})
export class BeverageListModalComponent implements OnInit {

  public beverages: Beverage[] = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  onClickBeverage(beverage: Beverage) {
    this.activeModal.close(beverage)
  }

}
