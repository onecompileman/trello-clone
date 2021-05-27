export interface Card {
  id?: string;
  name: string;
  description?: string;
  images?: string[];
  userId: string;
  boardId: string;
  listId: string;
}
