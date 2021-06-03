import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { dataURLtoFile } from '../utils/data-url-file.util';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageDataService {
  constructor(private angularFireStorage: AngularFireStorage) {}

  async upload(folderName: string, base64File: string) {
    const timestamp = +new Date();
    const randomId = Math.random().toString(10);

    const ref = this.angularFireStorage.ref(
      folderName + '/' + timestamp + randomId
    );

    const uploadTask = await ref.put(dataURLtoFile(base64File, 'thumb.png'));

    return await uploadTask.ref.getDownloadURL();
  }
}
