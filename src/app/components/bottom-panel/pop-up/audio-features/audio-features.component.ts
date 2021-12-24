import {Component, OnInit} from '@angular/core';
import {ScrollMaskComponent} from '../scroll-mask/scroll-mask.component';
import {SpotifyService} from '../../../../services/spotify/spotify.service';
import {Player} from '../../../../models/player.interface';
import {Item} from '../../../../models/item.interface';
import {AudioFeatures} from '../../../../models/audio-features.interface';

@Component({
  selector: 'app-audio-features',
  templateUrl: './audio-features.component.html',
  styleUrls: ['./audio-features.component.scss']
})
export class AudioFeaturesComponent extends ScrollMaskComponent implements OnInit {

  player: Player;
  currentItem: Item;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  valence: number;

  private _audioFeatures: AudioFeatures;

  constructor(private _spotifyService: SpotifyService) {
    super();
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      this.player = player;
      const item = player?.item;
      if (JSON.stringify(item) !== JSON.stringify(this.currentItem)) {
        this.loading = true;
        this.currentItem = player.item;
        this.setMask();
        this.getFeatures();
        this.emitLoadedEvent();
      }
    });
  }

  private getFeatures(): void {
    this._spotifyService.getAudioFeatures(this.currentItem.id).subscribe((features: AudioFeatures) => {
      this._audioFeatures = features;
      this.emitLoadedEvent();
      this.setAcousticness();
      this.setDanceability();
      this.setEnergy();
      this.setInstrumentalness();
      this.setSpeechiness();
      this.setLiveness();
      this.setValence();
      this.loading = false;
    });
  }

  private setAcousticness(): void {
    this.acousticness = this._audioFeatures.acousticness * 100;
  }

  private setDanceability(): void {
    this.danceability = this._audioFeatures.danceability * 100;
  }

  private setEnergy(): void {
    this.energy = this._audioFeatures.energy * 100;
  }

  private setInstrumentalness(): void {
    this.instrumentalness = this._audioFeatures.instrumentalness * 100;
  }

  private setLiveness(): void {
    this.liveness = this._audioFeatures.liveness * 100;
  }

  private setSpeechiness(): void {
    this.speechiness = this._audioFeatures.speechiness * 100;
  }

  private setValence(): void {
    this.valence = this._audioFeatures.valence * 100;
  }

}
