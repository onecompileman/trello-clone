import { Card } from './card.model';

export interface List {
  id?: string;
  name: string;
  boardId: string;
  userId: string;
  sortPosition: number;

  $$cards?: Card[];
}
