import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpotifyService} from '../../service/spotify.service';
import {TokenResponse} from '../../models/token-response.interface';
import {ColorsEnum} from '../../../../enums/colors.enum';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  spinnerColor = ColorsEnum.ORANGE;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error != null && error !== '') {
      this.router.navigate(['./error']);
    } else {
      this.spotifyService.accessToken = this.route.snapshot.queryParamMap.get('code');
      this.spotifyService.spotifyRefreshToken().subscribe((data: TokenResponse) => {
        if (data.refresh_token) {
          this.spotifyService.refreshToken = data.refresh_token;
        }
        if (data.access_token) {
          this.spotifyService.accessToken = data.access_token;
        }

        this.router.navigate(['./main']);
      });
    }

  }

}
