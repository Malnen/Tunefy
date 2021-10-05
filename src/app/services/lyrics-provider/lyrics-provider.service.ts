import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.interface';

@Injectable({
  providedIn : 'root'
})
export class LyricsProviderService {

  constructor(private _http: HttpClient) { }

  getLyrics(item: Item): Observable<any> {
    const artist = item.artists[ 0 ].name;
    const track = item.name;
    const url = `https://api.lyrics.ovh/v1/${ artist }/${ track }`;

    return this._http.get(url);
  }

}
