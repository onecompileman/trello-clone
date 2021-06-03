import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'tc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'trello-clone';

  isLoading: boolean;

  constructor(
    private loadingService: LoadingService,
    private changeDetectRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe((loading) => {
      setTimeout(() => (this.isLoading = loading), 10);
      console.log(loading);
      this.changeDetectRef.markForCheck();
    });
  }
}
