import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { BoardStateService } from '../services/board-state.service';
import { BoardDataService } from '../data-services/board.data-service';
import { take, tap, switchMap } from 'rxjs/operators';
import { ListDataService } from '../data-services/list.data-service';

@Injectable({ providedIn: 'root' })
export class BoardInfoResolver implements Resolve<any> {
  constructor(
    private boardStateService: BoardStateService,
    private boardDataService: BoardDataService,
    private listDataService: ListDataService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const boardId = route.params.id;

    return this.boardDataService.getBoard(boardId).pipe(
      take(1),
      switchMap((board) => {
        if (board) {
          this.boardStateService.activeBoard$.next(<any>board);
          return this.listDataService.getAllByBoardId(boardId).pipe(take(1));
        }
        console.log('heere');
        this.router.navigate(['/main']);
        return of([]);
      }),
      tap((lists) => {
        console.log(lists);
        this.boardStateService.activeBoardLists$.next(lists);
      })
    );
  }
}
