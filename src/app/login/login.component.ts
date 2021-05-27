import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'tc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
  }

  ngOnDestroy() {}

  login() {
    this.authService.googleSignin();
  }
  private checkIfLoggedIn() {
    this.authService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      console.log(user);
      if (user) {
        this.router.navigate(['/main']);
      }
    });
  }
}
