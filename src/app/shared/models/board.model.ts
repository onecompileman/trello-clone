import { User } from './user.model';

export interface Board {
  id?: string;
  name?: string;
  colorCode?: string;
  userId?: string;
  users?: string[];

  $$users?: User[];
  $$owner?: User;
}
