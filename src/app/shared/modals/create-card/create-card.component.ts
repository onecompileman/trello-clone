import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { cloneDeep } from 'lodash';
import { toBase64 } from 'src/app/core/utils/to-base-64.util';
import { CloudStorageDataService } from 'src/app/core/data-services/cloud-storage.data-service';
import { CardDataService } from 'src/app/core/data-services/card.data-service';
import { Card } from '../../models/card.model';
import { List } from '../../models/list.model';
import { Board } from '../../models/board.model';
import { BoardStateService } from 'src/app/core/services/board-state.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'tc-create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.scss'],
})
export class CreateCardComponent implements OnInit {
  list: List;
  userId: string;

  isCreating: boolean;
  createCardForm: FormGroup;

  images: any[] = [];
  imageURLs: string[] = [];
  imageURLsToUpload: string[] = [];

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private cloudStorageService: CloudStorageDataService,
    private cardDataService: CardDataService,
    private boardStateService: BoardStateService,
    private toastrService: ToastrService
  ) {}

  get name(): AbstractControl {
    return this.createCardForm.get('name');
  }

  get description(): AbstractControl {
    return this.createCardForm.get('description');
  }

  ngOnInit(): void {
    this.initForm();
  }

  async onUploadImage($event) {
    this.images.push(cloneDeep($event.target.files[0]));

    const base64Image = await toBase64($event.target.files[0]);
    this.imageURLsToUpload.push(<string>base64Image);
    this.imageURLs.push('url(' + base64Image + ')');
  }

  removeImage(index) {
    this.imageURLs.splice(index, 1);
    this.images.splice(index, 1);
  }

  async createCard() {
    this.isCreating = true;

    let images = [];

    if (this.images) {
      const uploadAllImages = this.imageURLsToUpload.map((image) =>
        this.cloudStorageService.upload('cards', image)
      );
      images = await Promise.all(uploadAllImages);
    }

    const card: Card = {
      name: this.name.value,
      description: this.description.value,
      images,
      userId: this.userId,
      listId: this.list.id,
      boardId: this.list.boardId,
      sortPosition: this.list.$$cards ? this.list.$$cards.length : 0,
    };

    const createdCard = await this.cardDataService.create(card);
    card.id = createdCard.id;

    this.boardStateService.addCardToList(this.list.id, card);
    this.isCreating = false;

    this.toastrService.success('Created card successfully!');
    this.modalRef.hide();
  }

  private initForm() {
    this.createCardForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(50)]],
      description: [null, [Validators.required]],
    });
  }
}
