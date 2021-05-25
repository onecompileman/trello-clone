import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { BoardComponent } from './board/board.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [MainComponent, HomeComponent, BoardComponent],
  imports: [CommonModule, SharedModule, MainRoutingModule, CoreModule],
})
export class MainModule {}
