import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Board } from 'src/app/shared/models/board.model';
import { BoardStateService } from '../../services/board-state.service';
import { BoardDataService } from '../../data-services/board.data-service';
import { tap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  CreateBoardComponent,
  ConfirmationComponent,
} from 'src/app/shared/modals';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'tc-board-nav',
  templateUrl: './board-nav.component.html',
  styleUrls: ['./board-nav.component.scss'],
})
export class BoardNavComponent implements OnInit {
  user: any;
  activeBoard: Board;

  isOwner: boolean;
  constructor(
    private authService: AuthService,
    private boardStateService: BoardStateService,
    private boardDataService: BoardDataService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    combineLatest(this.getActiveUser(), this.getActiveBoard()).subscribe(
      ([user, board]) => {
        this.isOwner = board.userId === user.id;
      }
    );
  }

  editBoard() {
    this.modalService.show(CreateBoardComponent, {
      initialState: {
        isEdit: true,
        board: this.activeBoard,
      },
    });
  }

  leaveBoard() {
    const confirmCallback = async () => {
      const index = this.activeBoard.users.indexOf(this.user.id);
      this.activeBoard.users.splice(index, 1);

      await this.boardDataService.update({
        id: this.activeBoard.id,
        users: this.activeBoard.users,
      });

      this.router.navigate(['/main']);
    };

    const message = `Are you sure to leave this board?`;

    this.modalService.show(ConfirmationComponent, {
      ignoreBackdropClick: true,
      initialState: {
        confirmCallback,
        message,
      },
    });
  }

  removeUser(index: number) {
    const confirmCallback = () => {
      this.activeBoard.users.splice(index, 1);
      this.activeBoard.$$users.splice(index, 1);
      this.boardDataService.update({
        id: this.activeBoard.id,
        users: this.activeBoard.users,
      });
    };
    const userToRemove = this.activeBoard.$$users[index];
    const message = `Are you sure to remove <b>${userToRemove.displayName}</b> to the board?`;

    this.modalService.show(ConfirmationComponent, {
      ignoreBackdropClick: true,
      initialState: {
        confirmCallback,
        message,
      },
    });
  }

  deleteBoard() {
    const confirmCallback = async () => {
      await this.boardDataService.delete(this.activeBoard.id);
      this.toastrService.success('Board deleted successfully!');
      this.router.navigate(['/main']);
    };

    const message = `Are you sure to delete board: <b>${this.activeBoard.name}</b> ?`;

    this.modalService.show(ConfirmationComponent, {
      initialState: {
        confirmCallback,
        message,
      },
    });
  }

  private getActiveUser(): Observable<any> {
    return this.authService.user$.pipe(
      tap((user) => {
        this.user = user;
      })
    );
  }

  private getActiveBoard(): Observable<any> {
    return this.boardStateService.activeBoard$.pipe(
      tap((board) => (this.activeBoard = board))
    );
  }
}
