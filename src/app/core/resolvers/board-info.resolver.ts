import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of, zip } from 'rxjs';
import { BoardStateService } from '../services/board-state.service';
import { BoardDataService } from '../data-services/board.data-service';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { ListDataService } from '../data-services/list.data-service';
import { CardDataService } from '../data-services/card.data-service';
import { UserDataService } from '../data-services/user.data-service';

@Injectable({ providedIn: 'root' })
export class BoardInfoResolver implements Resolve<any> {
  constructor(
    private boardStateService: BoardStateService,
    private boardDataService: BoardDataService,
    private listDataService: ListDataService,
    private cardDataService: CardDataService,
    private userDataService: UserDataService,
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
        return zip(
          this.userDataService.getUser(board.userId),
          board.users && board.users.length
            ? this.userDataService.getAllByIds(board.users)
            : of([])
        ).pipe(
          map(([owner, users]) => {
            return {
              ...board,
              $$owner: owner,
              $$users: users,
              users: board.users || [],
            };
          })
        );
      }),
      switchMap((board) => {
        if (board) {
          this.boardStateService.activeBoard$.next(<any>board);

          return this.listDataService.getAllByBoardId(boardId).pipe(
            take(1),
            switchMap((lists) => {
              console.log(lists);
              if (lists.length) {
                const allCards$ = lists.map((list) =>
                  this.cardDataService.getAllByListId(list.id).pipe(take(1))
                );

                return zip(...allCards$).pipe(
                  map((cards) => {
                    return lists.map((l, i) => ({
                      ...l,
                      $$cards: cards[i].sort(
                        (a, b) => a.sortPosition - b.sortPosition
                      ),
                    }));
                  })
                );
              }
              return of([]);
            })
          );
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
