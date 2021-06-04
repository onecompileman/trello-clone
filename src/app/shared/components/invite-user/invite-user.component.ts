import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserDataService } from 'src/app/core/data-services/user.data-service';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { filter, debounceTime, switchMap, map, tap } from 'rxjs/operators';
import { User } from '../../models/user.model';

import { cloneDeep } from 'lodash';
import { Board } from '../../models/board.model';
import { BoardDataService } from 'src/app/core/data-services/board.data-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tc-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss'],
})
export class InviteUserComponent implements OnInit {
  @Input() board: Board;

  searchForm: FormGroup;

  usersToAdd: User[] = [];

  users: User[] = [];
  filteredUsers: User[] = [];

  isInvitingUsers: boolean;

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder,
    private boardDataService: BoardDataService,
    private toastrService: ToastrService
  ) {}

  get search(): AbstractControl {
    return this.searchForm.get('search');
  }
  ngOnInit(): void {
    this.initForm();
    this.listenToFormChanges();
    this.getAllUsersExceptYou();
  }

  addUserToBoard(user: User) {
    this.search.patchValue('');
    this.usersToAdd.push(user);
  }

  removeUser(index: number) {
    this.usersToAdd.splice(index, 1);
  }

  async inviteUsers() {
    this.isInvitingUsers = true;

    this.board.$$users = this.board.$$users.concat(this.usersToAdd);
    this.board.users = this.board.users.concat(
      this.usersToAdd.map((u) => u.id)
    );

    console.log(this.board);

    await this.boardDataService.update({
      id: this.board.id,
      users: this.board.users,
    });

    this.usersToAdd = [];
    this.toastrService.success('Added users to the board successfully');

    this.isInvitingUsers = false;
  }

  private initForm() {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });
  }

  private getAllUsersExceptYou() {
    this.authService.user$
      .pipe(
        switchMap((me) => {
          return this.userDataService.getAll().pipe(
            tap(console.log),
            map((users) => users.filter((user) => user.id !== me.id))
          );
        })
      )
      .subscribe((users) => {
        this.filteredUsers = cloneDeep(users);
        this.users = cloneDeep(users);
      });
  }

  private listenToFormChanges() {
    this.search.valueChanges
      .pipe(
        debounceTime(200),
        filter((search) => search.length >= 3)
      )
      .subscribe((search) => {
        console.log(this.filteredUsers, search);
        this.filteredUsers = this.users.filter((user) => {
          const term = search.toLowerCase();
          const alreadyAdded =
            Boolean(this.usersToAdd.find((u) => u.id === user.id)) ||
            this.board.users.includes(user.id);

          return (
            (user.displayName.toLowerCase().includes(term) ||
              user.email.includes(search)) &&
            !alreadyAdded
          );
        });
      });
  }
}
