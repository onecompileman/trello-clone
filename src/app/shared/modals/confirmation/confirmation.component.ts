import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tc-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  message: string;
  confirmCallback: Function;

  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm(): void {
    this.confirmCallback();
    this.modalRef.hide();
  }
}
