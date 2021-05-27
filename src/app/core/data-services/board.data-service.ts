import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Board } from 'src/app/shared/models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardDataService {
  collectionName = 'boards';

  constructor(private angularFirestore: AngularFirestore) {}

  create(board: Board): Promise<any> {
    return this.angularFirestore.collection(this.collectionName).add(board);
  }

  getBoard(id: string): Observable<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(map((board: any) => ({ ...board, id })));
  }

  delete(id: string): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .delete();
  }

  update(board: Board): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(board.id)
      .set({ ...board }, { merge: true });
  }

  getAll(): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName)
      .valueChanges({ idField: 'id' });
  }

  getAllByUserId(userId: string): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName, (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges({ idField: 'id' });
  }
}
