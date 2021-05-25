import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'tc-create-board',
  templateUrl: './create-board.component.html',
  styleUrls: ['./create-board.component.scss'],
})
export class CreateBoardComponent implements OnInit {
  colorCodes: string[] = [
    '#F44336',
    '#E91E63',
    '#2196F3',
    '#673AB7',
    '#FF5722',
    '#FFC107',
    '#607D8B',
  ];

  activeColorCode: string = '';

  constructor(public modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.activeColorCode = this.colorCodes[0];
  }
}
