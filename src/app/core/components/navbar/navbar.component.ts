import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'tc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isBoardRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isBoardRoute = this.router.url.includes('board');
    this.routeChangeListener();
  }

  private routeChangeListener() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.isBoardRoute = this.router.url.includes('board');
      });
  }
}
