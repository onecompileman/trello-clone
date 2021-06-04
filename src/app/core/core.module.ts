import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import * as fromComponents from './components';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [...fromComponents.components],
  exports: [...fromComponents.components],
  imports: [CommonModule, SharedModule, RouterModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule can only be imported once!');
    }
  }
}
