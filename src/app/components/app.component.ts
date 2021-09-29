import { Component } from '@angular/core';
import { SpotifyService } from '../services/spotify/spotify.service';
import { CookieService } from 'ngx-cookie-service';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector : 'app-root',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.scss' ],
  providers : [
    SpotifyService,
    CookieService
  ]
})
export class AppComponent {
  title = 'Tunefy';

  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.registerFontClassAlias('devices', 'icon-tunefy-devices');
    iconRegistry.registerFontClassAlias('lyrics', 'icon-tunefy-lyrics');
  }
}
