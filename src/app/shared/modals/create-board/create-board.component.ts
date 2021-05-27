import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BoardDataService } from 'src/app/core/data-services/board.data-service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Board } from '../../models/board.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { BoardStateService } from 'src/app/core/services/board-state.service';

@Component({
  selector: 'tc-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent implements OnInit {
  colorCodes: string[] = [
    '#F44336',
    '#E91E63',
    '#2196F3',
    '#673AB7',
    '#FF5722',
    '#FFC107',
    '#607D8B',
  ];

  activeColorCode: string = '';
  boardForm: FormGroup;

  isCreating: boolean;
  isEdit: boolean;
  board: any = {};

  user: any;

  constructor(
    public modalRef: BsModalRef,
    private boardDataService: BoardDataService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private boardStateService: BoardStateService
  ) {}

  get name(): AbstractControl {
    return this.boardForm.get('name');
  }

  ngOnInit(): void {
    this.activeColorCode = this.board.colorCode || this.colorCodes[0];
    this.getUser();
    this.initForm();
  }

  async createBoard() {
    this.isCreating = true;
    const board: Board = {
      name: this.name.value,
      colorCode: this.activeColorCode,
      userId: this.user.id,
    };

    this.boardDataService.create(board);
    this.isCreating = false;
    this.toastrService.success('Created board successfully!');
    this.modalRef.hide();
  }

  async editBoard() {
    this.isCreating = true;
    const board: Board = {
      ...this.board,
      name: this.name.value,
      colorCode: this.activeColorCode,
    };

    this.boardDataService.update(board);
    this.boardStateService.activeBoard$.next(board);
    this.isCreating = false;
    this.toastrService.success('Updated board successfully!');
    this.modalRef.hide();
  }

  private initForm() {
    this.boardForm = this.formBuilder.group({
      name: [this.board.name, [Validators.required, Validators.maxLength(50)]],
    });
  }

  private getUser() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }
}
