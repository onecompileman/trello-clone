import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import * as fromModals from './modals';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTagsInputModule } from 'ngx-tags-input';
import * as fromComponents from './components';

@NgModule({
  declarations: [...fromModals.modals, ...fromComponents.components],
  entryComponents: [...fromModals.modals],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    DragDropModule,
    ModalModule.forRoot(),
    NgxTagsInputModule,
  ],
  exports: [
    BsDropdownModule,
    ModalModule,
    DragDropModule,
    NgxTagsInputModule,
    ...fromComponents.components,
    ...fromModals.modals,
  ],
})
export class SharedModule {}
