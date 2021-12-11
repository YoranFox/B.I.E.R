import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CodesService } from 'src/app/shared/services/codes.service';
import {
  BottomRoutes,
  EditRoutes,
  NavigationService,
} from 'src/app/shared/services/navigation.service';
import { Code } from 'src/app/_sdk/models';

@Component({
  selector: 'app-admin-codes',
  templateUrl: './admin-codes.component.html',
  styleUrls: ['./admin-codes.component.scss'],
})
export class AdminCodesComponent implements OnInit {
  public codes: Code[] = [];
  faAdd = faPlus;

  constructor(
    private codesService: CodesService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.fetchCodes();
  }

  async fetchCodes() {
    this.codes = await this.codesService.getCurrentCreatorCodes();
  }

  onClickCode(id: string) {
    this.navigationService.navigateToEdit(EditRoutes.CODE, id);
  }

  onClickAddCode() {
    this.navigationService.navigateToEdit(EditRoutes.CODE);
  }
}
