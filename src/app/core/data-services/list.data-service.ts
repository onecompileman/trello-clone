import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { List } from 'src/app/shared/models/list.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ListDataService {
  collectionName = 'lists';

  constructor(private angularFirestore: AngularFirestore) {}

  create(list: List): Promise<any> {
    return this.angularFirestore.collection(this.collectionName).add(list);
  }

  getList(id: string): Observable<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(map((list: any) => ({ ...list, id })));
  }

  delete(id: string): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .delete();
  }

  update(list: List): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(list.id)
      .set({ ...list }, { merge: true });
  }

  getAllByBoardId(boardId: string): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName, (ref) =>
        ref.where('boardId', '==', boardId)
      )
      .valueChanges({ idField: 'id' });
  }
}
