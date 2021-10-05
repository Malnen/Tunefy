import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ColorsEnum } from '../../../../enums/colors.enum';
import { SpotifyService } from '../../../../services/spotify/spotify.service';
import { Devices } from '../../../../models/devices.interface';
import { DeviceType } from '../../../../enums/device-type.enum';
import { Player } from '../../../../models/player.interface';
import { BasePopUpContentComponent } from '../base-pop-up-content/base-pop-up-content.component';

@Component({
  selector : 'app-devices-wrapper',
  templateUrl : './devices-wrapper.component.html',
  styleUrls : [ './devices-wrapper.component.scss' ]
})
export class DevicesWrapperComponent extends BasePopUpContentComponent implements OnInit {

  devices: Devices;
  deviceType = DeviceType;
  player: Player;

  constructor(private _spotifyService: SpotifyService) {
    super();
  }

  ngOnInit(): void {
    this._spotifyService.hasPlayerUpdated().subscribe((player: Player) => {
      if (this.player == null) {
        this._spotifyService.getDevices().subscribe((data: Devices) => {
          this.devices = data;
          this.loading = false;
          this.emitLoadedEvent();
        });
      }

      this.player = player;
    });
  }

  onDeviceClick(id: string): void {
    this._spotifyService.setAsCurrentDevice(id).subscribe();
  }

}
