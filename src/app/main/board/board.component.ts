import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  CreateCardComponent,
  ConfirmationComponent,
} from 'src/app/shared/modals';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CardInfoComponent } from 'src/app/shared/modals/card-info/card-info.component';
import { BoardStateService } from 'src/app/core/services/board-state.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { List } from 'src/app/shared/models/list.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ListDataService } from 'src/app/core/data-services/list.data-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tc-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  lists: List[] = [
    // {
    //   name: 'Todo',
    //   cards: ['Login Screen', ' Registration Screen', 'App Setup'],
    // },
    // { name: 'Doing', cards: ['haha'] },
    // { name: 'For Deployment', cards: [] },
    // { name: 'Done', cards: [] },
  ];

  activeBoard: any;
  user: any;

  isAddListOpen: boolean;

  addListForm: FormGroup;
  isAddingListForm: boolean;

  constructor(
    private modalService: BsModalService,
    private boardStateService: BoardStateService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private listDataService: ListDataService,
    private toastrService: ToastrService
  ) {}

  get listName(): AbstractControl {
    return this.addListForm.get('name');
  }

  ngOnInit(): void {
    this.getUser();
    this.getActiveBoard();
    this.getLists();
    this.initAddListForm();
  }

  ngOnDestroy(): void {}

  addCard() {
    this.modalService.show(CreateCardComponent, {
      class: 'modal-lg',
    });
  }

  viewCard() {
    this.modalService.show(CardInfoComponent, {
      class: 'modal-lg',
    });
  }

  async deleteList(list: List) {
    const confirmCallback = () => {
      this.listDataService.delete(list.id);
      this.boardStateService.removeActiveBoardList(list);
    };

    const message = `Are you sure to delete list <b>${list.name}</b>`;

    this.modalService.show(ConfirmationComponent, {
      initialState: {
        confirmCallback,
        message,
      },
    });
  }

  async createList() {
    const list: List = {
      name: this.listName.value,
      boardId: this.activeBoard.id,
      userId: this.user.id,
      sortPosition: this.lists.length,
    };

    this.isAddingListForm = true;
    const createdList = await this.listDataService.create(list);
    list.id = createdList.id;
    this.boardStateService.addActiveBoardList(list);
    this.isAddListOpen = false;

    this.isAddingListForm = false;

    this.toastrService.success('Created list successfully!');
    this.addListForm.reset();
  }

  get connectedList() {
    return this.lists.map((l) => l.name);
  }

  async dropList(event: any) {
    if (event.previousContainer === event.container) {
      const list1 = this.lists[event.previousIndex];
      const list2 = this.lists[event.currentIndex];

      list1.sortPosition = event.currentIndex;
      list2.sortPosition += event.currentIndex < event.previousIndex ? 1 : -1;
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.boardStateService.updateActiveBoardList(list1);
      this.boardStateService.updateActiveBoardList(list2);

      await this.listDataService.update(list1);
      await this.listDataService.update(list2);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  private getActiveBoard() {
    this.boardStateService.activeBoard$
      .pipe(untilDestroyed(this))
      .subscribe((activeBoard) => (this.activeBoard = activeBoard));
  }
  private getLists() {
    this.boardStateService.activeBoardLists$
      .pipe(untilDestroyed(this))
      .subscribe(
        (lists) =>
          (this.lists = lists.sort((a, b) => a.sortPosition - b.sortPosition))
      );
  }

  private getUser() {
    this.authService.user$
      .pipe(untilDestroyed(this))
      .subscribe((user) => (this.user = user));
  }

  private initAddListForm() {
    this.addListForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(25)]],
    });
  }
}
