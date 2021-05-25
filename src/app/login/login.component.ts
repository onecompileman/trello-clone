import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'tc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  login() {
    this.authService.googleSignin();
  }
  private checkIfLoggedIn() {
    this.authService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.router.navigate(['/main']);
      }
    });
  }
}
