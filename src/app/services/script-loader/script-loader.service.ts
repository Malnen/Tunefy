import { Injectable } from '@angular/core';

@Injectable({
  providedIn : 'root'
})
export class ScriptLoaderService {

  private _scripts = [];

  constructor() {
  }

  loadSpotifyScript(): void {
    const src = 'https://sdk.scdn.co/spotify-player.js';
    this.loadScript(src);
  }

  loadSpotifyPlayerScript(): void {
    const src = './assets/javascript/spotify-player.js';
    this.loadScript(src);
  }

  removeScripts(): void {
    for (const script of this._scripts) {
      document.getElementsByTagName('head')[ 0 ].removeChild(script);
    }

    this._scripts = [];
  }

  private loadScript(src: string): void {
    const node = document.createElement('script');
    node.src = src;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[ 0 ].appendChild(node);
    this._scripts.push(node);
  }

}
