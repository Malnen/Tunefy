import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

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

  private loadScript(src: string): void {
    const node = document.createElement('script');
    node.src = src;
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);

  }

}
