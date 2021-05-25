import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateCardComponent } from 'src/app/shared/modals';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CardInfoComponent } from 'src/app/shared/modals/card-info/card-info.component';

@Component({
  selector: 'tc-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  lists: any[] = [
    {
      name: 'Todo',
      cards: ['Login Screen', ' Registration Screen', 'App Setup'],
    },
    { name: 'Doing', cards: ['haha'] },
    { name: 'For Deployment', cards: [] },
    { name: 'Done', cards: [] },
  ];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

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

  get connectedList() {
    return this.lists.map((l) => l.name);
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropCards(event: any) {
    console.log(event);
  }
}
