import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodesService } from 'src/app/shared/services/codes.service';
import {
  BottomRoutes,
  NavigationService,
} from 'src/app/shared/services/navigation.service';
import { Beverage, Code, Robot, User } from 'src/app/_sdk/models';
import {
  faTrash,
  faPen,
  faCheck,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BeverageListModalComponent } from 'src/app/shared/modals/beverage-list-modal/beverage-list-modal.component';
import { BeveragesService } from 'src/app/shared/services/beverages.service';

@Component({
  selector: 'app-code-detail',
  templateUrl: './code-detail.component.html',
  styleUrls: ['./code-detail.component.scss'],
})
export class CodeDetailComponent implements OnInit {
  loading = false;
  new = false;

  codeId!: string;
  code: Code | undefined;

  faTrash = faTrash;
  faPen = faPen;
  faCheck = faCheck;
  faArrow = faArrowLeft;

  form = new FormGroup({
    code: new FormControl(null, Validators.required),
    description: new FormControl(null),
    users: new FormArray([]),
    robots: new FormControl([]),
    beverages: new FormControl([]),
    map: new FormControl(null),
  });

  userEditIndex: number | undefined;
  codeEdit = false;
  descriptionEdit = false;

  constructor(
    private codesService: CodesService,
    private router: Router,
    private navigationService: NavigationService,
    private modalService: NgbModal,
    private beveragesService: BeveragesService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.new = state?.new;
    this.codeId = state?.id;
  }

  ngOnInit(): void {
    if (!this.new) {
      if (!this.codeId) {
        // route back to codes
        this.navigationService.navigateTo(BottomRoutes.CREATOR_CODES);
        return;
      }
      this.fetchCode();
    }
  }

  async fetchCode() {
    this.code = await this.codesService.getCode(this.codeId);
    this.form.patchValue({
      ...this.code,
    });

    this.form.patchValue({
      users: null,
    });

    this.code?.users.forEach((user) => {
      this.users.push(this.createUserForm(user));
    });
  }

  async onSubmit() {
    this.loading = true;
    const currentCode = this.form.getRawValue();
    try {
      if (this.new) {
        await this.codesService.createCode(currentCode);
      } else {
        await this.codesService.updateCode(this.codeId, currentCode);
      }
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }

  onClickBack() {
    this.navigationService.navigateTo(BottomRoutes.CREATOR_CODES);
  }

  onClickImportUsersFromParty() {}

  onClickEditUser(index: number) {
    if (this.users.valid) {
      this.userEditIndex = index;
    }
  }

  onClickSaveUser() {
    if (this.users.valid) {
      delete this.userEditIndex;
    }
  }

  onClickRemoveUser(index: number) {
    this.users.removeAt(index);
  }

  async onClickAddBeverage() {
    const modalRef = this.modalService.open(BeverageListModalComponent, {});
    modalRef.componentInstance.beverages =
      await this.beveragesService.getCurrentCreatorBeverages();
    modalRef.result.then((result) => {
      if (result) {
        const b = this.beverages;
        b.push(result);

        this.form.patchValue({ beverages: b });
      }
    });
  }

  onClickRemoveBeverage(index: number) {
    const b = this.beverages;
    b.splice(index, 1);
    this.form.patchValue({ beverages: b });
  }

  onClickAddRobot() {}

  createUserForm(user?: User) {
    const userForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
    if (user) {
      userForm.addControl('id', new FormControl(null));
      userForm.patchValue({
        ...user,
      });
    }
    return userForm;
  }

  createNewUser() {
    if (this.users.valid) {
      this.users.push(this.createUserForm());
      this.userEditIndex = this.users.length - 1;
    }
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

  get beverages(): Beverage[] {
    return this.form.get('beverages')?.value;
  }

  get robots(): Robot[] {
    return this.form.get('robots')?.value;
  }
}
