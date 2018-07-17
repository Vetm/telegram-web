import {Injectable} from '@angular/core';
import * as localforage from 'localforage';
import {DomSanitizer} from "@angular/platform-browser";

//declare let localforage;

@Injectable()
export class StorageService {

  private store;

  constructor(private sanitizer: DomSanitizer) {
    this.store = localforage.createInstance({
      name: 'files'
    });
  }

  public async saveFile(inputFileLocation, file, type) {
    const key = this.generateHash(inputFileLocation);
    const blob = new Blob([file], {type: 'image/jpeg'});
    this.store.setItem(key, blob);
    return this.createBlobUrl(blob);
  }

  public async retrieveFile(inputFileLocation) {
    const key = this.generateHash(inputFileLocation);
    const blob = await this.store.getItem(key);
    if (blob) {
      return this.createBlobUrl(blob);
    } else {
      return false;
    }
  }

  private generateHash(obj: string) {
    const str = String(JSON.stringify(obj));
    let hash: any = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return (hash * -1) + '';
  };

  private createBlobUrl(blob) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
  }

}
