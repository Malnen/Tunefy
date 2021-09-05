import {Component} from '@angular/core';
import {SpotifyService} from './login/service/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ SpotifyService]
})
export class AppComponent {
  title = 'Tunefy';

}
