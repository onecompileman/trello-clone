import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Board } from 'src/app/shared/models/board.model';
import { BoardStateService } from '../../services/board-state.service';
import { BoardDataService } from '../../data-services/board.data-service';

@Component({
  selector: 'tc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isBoardRoute: boolean = false;

  user: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private boardStateService: BoardStateService
  ) {}

  ngOnInit(): void {
    this.isBoardRoute = this.router.url.includes('board');
    this.routeChangeListener();
    this.getActiveUser();
  }

  logout() {
    this.authService.signOut();
  }

  searchCards(value) {
    if (!value.length || value.length > 3) {
      this.boardStateService.searchCardTerm$.next(value);
    }
  }

  private routeChangeListener() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isBoardRoute = this.router.url.includes('board');
      });
  }

  private getActiveUser() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }
}
