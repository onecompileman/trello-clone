import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Board } from 'src/app/shared/models/board.model';
import { List } from 'src/app/shared/models/list.model';

@Injectable({
  providedIn: 'root',
})
export class BoardStateService {
  activeBoard$: BehaviorSubject<Board> = new BehaviorSubject(null);
  activeBoardLists$: BehaviorSubject<List[]> = new BehaviorSubject([]);

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
