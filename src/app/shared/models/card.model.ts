export interface Card {
  id?: string;
  name: string;
  description?: string;
  images?: string[];
  sortPosition: number;
  userId: string;
  boardId: string;
  listId: string;
}
