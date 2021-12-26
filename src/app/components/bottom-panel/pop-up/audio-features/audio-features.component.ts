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
  acousticnessDescription: string;
  danceability: number;
  danceabilityDescription: string;
  energy: number;
  energyDescription: string;
  instrumentalness: number;
  instrumentalnessDescription: string;
  liveness: number;
  livenessDescription: string;
  speechiness: number;
  speechinessDescription: string;
  valence: number;
  valenceDescription: string;

  private _audioFeatures: AudioFeatures;

  constructor(private _spotifyService: SpotifyService) {
    super();
  }

  ngOnInit(): void {
    this.setDescriptions();
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

  onExpandClick(): void {
    setTimeout(() => this.setMask(), 0);
  }

  private setDescriptions(): void {
    this.acousticnessDescription = 'Miara od 0 do 100 określająca, czy ścieżka jest akustyczna.' +
      ' 100 oznacza dużą pewność, że utwór jest akustyczny.';
    this.danceabilityDescription = 'Opisuje, jak odpowiedni jest utwór do tańca w oparciu o kombinację elementów muzycznych, ' +
      'w tym tempo, stabilność rytmu, siłę uderzenia i ogólną regularność.' +
      ' Wartość 0 jest najmniej taneczna, a 100 jest najbardziej taneczna.';
    this.energyDescription = 'Energia jest miarą od 0 do 100 i reprezentuje percepcyjną miarę intensywności i ' +
      'aktywności. Zazwyczaj energetyczne utwory są szybkie, głośne i hałaśliwe. Na przykład death metal ma wysoką energię,' +
      ' podczas gdy preludium Bacha punktuje nisko na skali. Cechy percepcyjne przyczyniające' +
      ' się do tego atrybutu obejmują zakres dynamiczny, postrzeganą głośność, barwę, szybkość początków i ogólną entropię.';
    this.instrumentalnessDescription = 'Przewiduje, czy utwór nie zawiera wokali. ' +
      'Dźwięki „Ooh” i „aah” traktowane są w tym kontekście jako instrumentalne. ' +
      'Rapowe lub mówione utwory słowne są wyraźnie „wokalne”. ' +
      'Im wartość instrumentalizacji bliższa 100, tym większe prawdopodobieństwo, że utwór nie zawiera treści wokalnych. ' +
      'Wartości powyżej 50 mają reprezentować ścieżki instrumentalne, ale pewność jest wyższa, gdy wartość zbliża się do 100.';
    this.livenessDescription = 'Wykrywa obecność publiczności w nagraniu. ' +
      'Wyższe wartości żywotności oznaczają zwiększone prawdopodobieństwo, że utwór został wykonany na żywo. ' +
      'Wartość powyżej 80 zapewnia duże prawdopodobieństwo, że tor jest na żywo.';
    this.speechinessDescription = 'Wykrywa w utworze obecność wypowiadanych słów. ' +
      'Im bardziej w nagraniu występuje wyłącznie mowa (np. talk show, audiobook, poezja), ' +
      'tym wartość atrybutu jest bliższa 100.' +
      ' Wartości powyżej 66 opisują utwory, które prawdopodobnie składają się wyłącznie ze słów mówionych. ' +
      'Wartości od 33 do 66 opisują utwory, które mogą zawierać zarówno muzykę, jak i mowę, w sekcjach lub warstwach, ' +
      'w tym w utworach takich jak rap. ' +
      'Wartości poniżej 33 najprawdopodobniej reprezentują muzykę i inne utwory niemowe.';
    this.valenceDescription = 'Miara od 0 do 100 opisująca muzyczną pozytywność przekazywaną przez utwór. ' +
      'Utwory o wysokiej wartościowości brzmią bardziej pozytywnie (np. wesołe, euforyczne), ' +
      'podczas gdy utwory o niskiej wartościowości brzmią bardziej negatywnie (np. smutne, przygnębione, złości).';
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
