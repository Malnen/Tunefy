import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyService} from '../../../services/spotify/spotify.service';
import {TokenResponse} from '../../../models/token-response.interface';
import {ColorsEnum} from '../../../enums/colors.enum';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  spinnerColor = ColorsEnum.ORANGE;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    const error = this._route.snapshot.queryParamMap.get('error');

    if (error != null && error !== '') {
      this._router.navigate(['./error']);
    } else {
      this._spotifyService.accessToken = this._route.snapshot.queryParamMap.get('code');
      this._spotifyService.spotifyRefreshToken().subscribe((data: TokenResponse) => {
        if (data.refresh_token) {
          this._spotifyService.refreshToken = data.refresh_token;
        }
        if (data.access_token) {
          this._spotifyService.accessToken = data.access_token;
        }

        this._router.navigate(['./main']);
      });
    }

  }

}
