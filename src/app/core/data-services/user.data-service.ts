import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { List } from 'src/app/shared/models/list.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  collectionName = 'users';

  constructor(private angularFirestore: AngularFirestore) {}

  getUser(id: string): Observable<any> {
    return this.angularFirestore
      .collection(this.collectionName)
      .doc(id)
      .valueChanges()
      .pipe(
        take(1),
        map((user: any) => ({ ...user, id }))
      );
  }

  getAll(): Observable<any[]> {
    return this.angularFirestore
      .collection(this.collectionName)
      .valueChanges({ idField: 'id' });
  }

  getAllByIds(userIds: string[]) {
    return this.angularFirestore
      .collection(this.collectionName, (ref) => ref.where('uid', 'in', userIds))
      .valueChanges({ idField: 'id' });
  }
}
