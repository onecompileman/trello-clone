import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateBoardComponent } from 'src/app/shared/modals/create-board/create-board.component';
import { Board } from 'src/app/shared/models/board.model';
import { Observable } from 'rxjs';
import { BoardDataService } from 'src/app/core/data-services/board.data-service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthService } from 'src/app/core/services/auth.service';
import { tap } from 'rxjs/operators';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'tc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  boards$: Observable<Board[]>;
  sharedBoards$: Observable<Board[]>;
  user: any;

  constructor(
    private modalService: BsModalService,
    private boardDataService: BoardDataService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getUser$()
      .pipe(tap(() => this.getBoards()))
      .subscribe(() => {
        this.loadingService.loading$.next(false);
      });
  }

  ngOnDestroy(): void {}

  addBoard() {
    this.modalService.show(CreateBoardComponent, {
      ignoreBackdropClick: true,
    });
  }

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
