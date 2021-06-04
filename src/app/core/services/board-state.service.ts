import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Board } from 'src/app/shared/models/board.model';
import { List } from 'src/app/shared/models/list.model';
import { Card } from 'src/app/shared/models/card.model';

@Injectable({
  providedIn: 'root',
})
export class BoardStateService {
  activeBoard$: BehaviorSubject<Board> = new BehaviorSubject(null);
  activeBoardLists$: BehaviorSubject<List[]> = new BehaviorSubject([]);
  searchCardTerm$: BehaviorSubject<string> = new BehaviorSubject(null);
  activeBoardSub: Subscription;

  addCardToList(listId: string, card: Card) {
    const lists = this.activeBoardLists$.getValue();
    const list = lists.find((l) => l.id === listId);

    if (!list.$$cards) {
      list.$$cards = [];
    }

    list.$$cards.push(card);

    this.activeBoardLists$.next(lists);
  }

  removeCardToTheList(listId: string, cardId: string) {
    const lists = this.activeBoardLists$.getValue();
    const list = lists.find((l) => l.id === listId);

    const cardIndex = list.$$cards.findIndex((c) => c.id === cardId);
    list.$$cards.splice(cardIndex, 1);

    this.activeBoardLists$.next(lists);
  }

  updateCardToTheList(listId: string, card: Card) {
    const lists = this.activeBoardLists$.getValue();
    const list = lists.find((l) => l.id === listId);

    const cardIndex = list.$$cards.findIndex((c) => c.id === card.id);
    list.$$cards[cardIndex] = card;

    this.activeBoardLists$.next(lists);
  }

  addActiveBoardList(list: List) {
    const lists = this.activeBoardLists$.getValue();
    lists.push(list);
    this.activeBoardLists$.next(lists);
  }

  removeActiveBoardList(list: List) {
    const lists = this.activeBoardLists$.getValue();
    const listIndex = lists.findIndex((l) => l.id === list.id);

    lists.splice(listIndex, 1);
    this.activeBoardLists$.next(lists);
  }

  updateActiveBoardList(list: List) {
    const lists = this.activeBoardLists$.getValue();
    const listIndex = lists.findIndex((l) => l.id === list.id);

    lists[listIndex] = list;
    this.activeBoardLists$.next(lists);
  }
}
