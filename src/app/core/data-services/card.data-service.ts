import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from 'src/app/shared/models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardDataService {
  collectionName = 'cards';

  constructor(private angularFirestore: AngularFirestore) {}

  create(card: Card): Promise<any> {
    return this.angularFirestore.collection(this.collectionName).add(card);
  }

  getCard(id: string): Observable<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(map((card: any) => ({ ...card, id })));
  }

  delete(id: string): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .delete();
  }

  update(card: Card): Promise<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(card.id)
      .set({ ...card }, { merge: true });
  }

  batchUpdates(cards: Card[]): Promise<any> {
    const batch = this.angularFirestore.firestore.batch();

    for (let i = 0; i < cards.length; i++) {
      batch.set(
        <any>(
          this.angularFirestore.firestore
            .collection(this.collectionName)
            .doc(cards[i].id)
        ),
        cards[i],
        { merge: true }
      );
    }

    return batch.commit();
  }

  getAllByBoardId(boardId: string): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName, (ref) =>
        ref.where('boardId', '==', boardId)
      )
      .valueChanges({ idField: 'id' });
  }

  getAllByListId(listId: string): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName, (ref) =>
        ref.where('listId', '==', listId)
      )
      .valueChanges({ idField: 'id' });
  }
}
