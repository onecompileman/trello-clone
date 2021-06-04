import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardDataService } from 'src/app/core/data-services/board.data-service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { Board } from '../../models/board.model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'tc-board-search',
  templateUrl: './board-search.component.html',
  styleUrls: ['./board-search.component.scss'],
})
export class BoardSearchComponent implements OnInit, OnDestroy {
  boards$: Observable<Board[]>;
  sharedBoards$: Observable<Board[]>;
  user: any;

  search: string;

  constructor(
    private boardDataService: BoardDataService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser$()
      .pipe(tap(() => this.getBoards()))
      .subscribe();
  }

  ngOnDestroy(): void {}

  private getBoards() {
    this.boards$ = this.boardDataService
      .getAllByUserId(this.user.id)
      .pipe(untilDestroyed(this));

    this.sharedBoards$ = this.boardDataService
      .getAllByAddedUserId(this.user.id)
      .pipe(untilDestroyed(this));
  }

  private getUser$(): Observable<any> {
    return this.authService.user$.pipe(
      untilDestroyed(this),
      tap((user) => (this.user = user))
    );
  }
}
