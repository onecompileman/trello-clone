import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import * as fromModals from './modals';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTagsInputModule } from 'ngx-tags-input';
import * as fromComponents from './components';
import * as fromPipes from './pipes';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
@NgModule({
  declarations: [
    ...fromModals.modals,
    ...fromComponents.components,
    ...fromPipes.pipes,
  ],
  entryComponents: [...fromModals.modals],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    DragDropModule,
    ModalModule.forRoot(),
    NgxTagsInputModule,
    TooltipModule.forRoot(),
    LightboxModule,
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgxTagsInputModule,
    TooltipModule,
    LightboxModule,
    ...fromComponents.components,
    ...fromModals.modals,
    ...fromPipes.pipes,
  ],
})
export class SharedModule {}
