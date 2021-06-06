import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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
import { LoadingService } from 'src/app/core/services/loading.service';
import { CardDataService } from 'src/app/core/data-services/card.data-service';
import { Card } from 'src/app/shared/models/card.model';
import { Router, ActivatedRoute } from '@angular/router';
import { flatten, cloneDeep } from 'lodash';
import { BoardInfoResolver } from 'src/app/core/resolvers/board-info.resolver';

@Component({
  selector: 'tc-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  lists: List[] = [];
  originalLists: List[] = [];

  disabledDrag: boolean;

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
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private cardDataService: CardDataService,
    private route: ActivatedRoute,
    private router: Router,
    private boardInfoResolver: BoardInfoResolver
  ) {}

  get listName(): AbstractControl {
    return this.addListForm.get('name');
  }

  ngOnInit(): void {
    this.init();
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    this.loadingService.loading$.next(false);
    this.listenToRouteChanges();
  }

  init() {
    this.getUser();
    this.getActiveBoard();
    this.getLists();
    this.initAddListForm();
  }

  addCard(list: List) {
    this.modalService.show(CreateCardComponent, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        list,
        userId: this.user.id,
      },
    });
  }

  viewCard(card: Card) {
    this.router.navigate([], {
      queryParams: {
        cardId: card.id,
      },
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
      $$cards: [],
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

  async dropCards(event: any) {
    console.log(event);

    let list1;
    let list2;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data.$$cards,
        event.previousIndex,
        event.currentIndex
      );

      list1 = cloneDeep(event.container.data);
      list2 = cloneDeep(event.previousContainer.data);

      list1.$$cards = list1.$$cards.map((l, i) => ({ ...l, sortPosition: i }));

      this.cardDataService.batchUpdates(list1.$$cards);
    } else {
      transferArrayItem(
        event.previousContainer.data.$$cards,
        event.container.data.$$cards,
        event.previousIndex,
        event.currentIndex
      );

      list1 = cloneDeep(event.container.data);
      list2 = cloneDeep(event.previousContainer.data);

      list1.$$cards = list1.$$cards.map((l, i) => ({
        ...l,
        sortPosition: i,
        listId: list1.id,
      }));
      list2.$$cards = list2.$$cards.map((l, i) => ({
        ...l,
        sortPosition: i,
        listId: list2.id,
      }));

      if (event.container.data.$$cards && event.container.data.$$cards.length) {
        this.cardDataService.batchUpdates(list1.$$cards);
      }

      if (
        event.previousContainer.data.$$cards &&
        event.previousContainer.data.$$cards.length
      ) {
        this.cardDataService.batchUpdates(list2.$$cards);
      }
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
      .subscribe((lists) => {
        this.lists = lists.sort((a, b) => a.sortPosition - b.sortPosition);
        this.originalLists = cloneDeep(this.lists);
        console.log(this.originalLists);
      });

    this.boardStateService.searchCardTerm$.subscribe((search) => {
      this.disabledDrag = Boolean(search);

      if (search) {
        this.lists = this.lists.map((list) => {
          list.$$cards = list.$$cards.filter((card) =>
            card.name.toLowerCase().includes(search.toLowerCase())
          );

          return list;
        });
      } else {
        this.lists = cloneDeep(this.originalLists);
      }
    });
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

  private listenToRouteChanges() {
    this.route.queryParams.subscribe(({ cardId }) => {
      if (cardId) {
        const lists = this.lists;
        const allCards = flatten(lists.map((l) => l.$$cards));

        const card = allCards.find((c) => c.id === cardId);

        if (card) {
          this.modalService.show(CardInfoComponent, {
            class: 'modal-lg',
            ignoreBackdropClick: true,
            initialState: {
              card,
              route: this.route,
            },
          });
        }
      }
    });

    this.route.params.subscribe(({ id }) => {
      this.boardInfoResolver.loadBoard(id).subscribe(() => {
        this.init();
      });
    });
  }
}
