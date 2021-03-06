import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../../services/spotify/spotify.service';
import { Profile } from '../../../models/profile.interface';
import { ColorsEnum } from '../../../enums/colors.enum';

@Component({
  selector : 'app-profile-bar',
  templateUrl : './profile-bar.component.html',
  styleUrls : [ './profile-bar.component.scss' ]
})
export class ProfileBarComponent implements OnInit {

  profile: Profile;
  open: boolean;
  showContent: boolean;
  showMask: boolean;
  spinnerColor = ColorsEnum.ORANGE;
  url: string;

  private _timer: any;

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this._spotifyService.hasProfileUpdate().subscribe((profile: Profile) => this.profile = profile);
    this._spotifyService.getProfile().subscribe((profile: Profile) => {
      this._spotifyService.updateProfile(profile);
      this.setUrl();
    });
  }

  onClick(): void {
    if (this.open) {
      this.open = false;
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this.showContent = false, 200);
    } else {
      this.showContent = true;
      this.open = true;
    }
  }

  logout(): void {
    this.showMask = true;
    setTimeout(() => this._spotifyService.logout(), 100);
  }

  private setUrl(): void {
    const hasProfile = this.profile != null;
    const hasImages = hasProfile ? this.profile?.images.length > 0 : false;
    const url = hasImages ? this.profile?.images[ 0 ].url : '';
    const hasUrl = url != null && url !== '';
    if (hasUrl) {
      this.url = this.profile?.images[ 0 ].url;
    } else {
      this.url = './assets/images/profile.png';
    }
  }

}
