import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageDataService {
  constructor(private angularFireStorage: AngularFireStorage) {}

  async upload(folderName: string, file: File) {
    const timestamp = +new Date();
    const randomId = Math.random().toString(10);

    const ref = this.angularFireStorage.ref(
      folderName + '/' + timestamp + randomId
    );

    const uploadTask = await ref.put(file);

    return await uploadTask.ref.getDownloadURL();
  }
}
