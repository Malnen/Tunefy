import {Component} from '@angular/core';
import {SpotifyService} from './login/service/spotify.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    SpotifyService,
    CookieService
  ]
})
export class AppComponent {
  title = 'Tunefy';

}