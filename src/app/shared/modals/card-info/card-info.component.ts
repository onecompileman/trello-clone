import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CardDataService } from 'src/app/core/data-services/card.data-service';
import { ToastrService } from 'ngx-toastr';
import { Card } from '../../models/card.model';
import { cloneDeep } from 'lodash';
import { toBase64 } from 'src/app/core/utils/to-base-64.util';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { CloudStorageDataService } from 'src/app/core/data-services/cloud-storage.data-service';
import { Router } from '@angular/router';

@Component({
  selector: 'tc-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss'],
})
export class CardInfoComponent implements OnInit, OnDestroy {
  card: Card;

  editCardForm: FormGroup;

  isNameEdit: boolean;
  isDescriptionEdit: boolean;

  images: any[] = [];
  imageURLs: string[] = [];
  imageURLsToUpload: string[] = [];

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private cardDataService: CardDataService,
    private cloudStorageService: CloudStorageDataService,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  get name(): AbstractControl {
    return this.editCardForm.get('name');
  }

  get description(): AbstractControl {
    return this.editCardForm.get('description');
  }

  async onUploadImage($event) {
    this.images.push(cloneDeep($event.target.files[0]));

    const base64Image = await toBase64($event.target.files[0]);
    this.imageURLsToUpload.push(<string>base64Image);
    this.imageURLs.push('url(' + base64Image + ')');

    this.update();
  }

  ngOnInit(): void {
    console.log(this.card);
    this.initForm();
  }

  ngOnDestroy() {
    this.router.navigate([], {
      queryParams: {},
    });
  }

  closeModal() {
    this.modalRef.hide();
  }

  deleteCard() {
    const confirmCallback = async () => {
      await this.cardDataService.delete(this.card.id);
      this.toastrService.success('Deleted card successfully!');
      this.closeModal();
    };

    this.modalService.show(ConfirmationComponent, {
      ignoreBackdropClick: true,
      initialState: {
        confirmCallback,
        message: 'Are you sure to delete this card?',
      },
    });
  }

  async update() {
    let images = [];

    if (this.imageURLsToUpload.length) {
      const uploadAllImages = this.imageURLsToUpload.map((image) =>
        this.cloudStorageService.upload('cards', image)
      );
      images = await Promise.all(uploadAllImages);

      this.imageURLsToUpload = [];
      this.imageURLs = [];
    }

    this.card.name = this.name.value;
    this.card.description = this.description.value;
    this.card.images = this.card.images.concat(images);

    console.log(this.card);

    this.cardDataService.update(this.card);
  }

  removeImage(index) {
    this.imageURLs.splice(index, 1);
    this.images.splice(index, 1);
  }

  removeExistingImage(index) {
    this.imageURLs.splice(index, 1);
    this.card.images.splice(index, 1);
    this.cardDataService.update(this.card);
  }

  private initForm() {
    this.editCardForm = this.formBuilder.group({
      name: [this.card.name, [Validators.required, Validators.maxLength(50)]],
      description: [this.card.description, [Validators.required]],
    });
  }
}
