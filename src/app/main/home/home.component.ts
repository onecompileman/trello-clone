import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateBoardComponent } from 'src/app/shared/modals/create-board/create-board.component';

@Component({
  selector: 'tc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {}

  addBoard() {
    this.modalService.show(CreateBoardComponent, {
      ignoreBackdropClick: true,
    });
  }
}
