import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Board } from '../models/board.model';

@Pipe({
  name: 'searchBoard',
})
export class SearchBoardPipe implements PipeTransform {
  constructor() {}

  transform(boards: Board[], search: string) {
    return search
      ? boards.filter((b) =>
          b.name.toLowerCase().includes(search.toLowerCase())
        )
      : boards;
  }
}
