import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/components/app.component';
import { MainComponent } from './app/components/main/main.component';
import { LoginComponent } from './app/components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CallbackComponent } from './app/components/login/callback/callback.component';
import { ErrorPageComponent } from './app/components/login/error-page/error-page.component';
import { GlobalHttpInterceptor } from './app/services/global-http-interceptor/global-http-interceptor';
import { SpotifyService } from './app/services/spotify/spotify.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerDirective } from './app/directives/spinner.directive';
import { PanelWrapperComponent } from './app/components/panel-wrapper/panel-wrapper.component';
import { LeftPanelComponent } from './app/components/left-panel/left-panel.component';
import { RightPanelComponent } from './app/components/right-panel/right-panel.component';
import { ResizableDirective } from './app/directives/resizable.directive';
import { BottomPanelComponent } from './app/components/bottom-panel/bottom-panel.component';
import { ProgressBarComponent } from './app/components/bottom-panel/progress-bar/progress-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DevicesWrapperComponent } from './app/components/bottom-panel/pop-up/devices-wrapper/devices-wrapper.component';
import { HoverDirective } from './app/directives/hover.directive';
import { VolumeBarComponent } from './app/components/bottom-panel/volume-bar/volume-bar.component';
import { PopUpComponent } from './app/components/bottom-panel/pop-up/pop-up.component';
import { LyricsWrapperComponent } from './app/components/bottom-panel/pop-up/lyrics-wrapper/lyrics-wrapper.component';
import { SafeHtmlPipe } from './app/pipes/safe-html.pipe';
import { QueueWrapperComponent } from './app/components/bottom-panel/pop-up/queue-wrapper/queue-wrapper.component';
import { SearchBarComponent } from './app/components/right-panel/search-bar/search-bar.component';
import { ArtistResultComponent } from './app/components/right-panel/search-bar/artist-result/artist-result.component';
import { TrackResultComponent } from './app/components/right-panel/search-bar/track-result/track-result.component';
import { AlbumResultComponent } from './app/components/right-panel/search-bar/album-result/album-result.component';
import { ContextMenuComponent } from './app/components/context-menu/context-menu.component';
import { OptionComponent } from './app/components/context-menu/option/option/option.component';
import { BaseComponent } from './app/components/base-component/base.component';
import { ProfileBarComponent } from './app/components/left-panel/profile-bar/profile-bar.component';
import { LinkTileComponent } from './app/components/left-panel/link-tile/link-tile.component';
import { HomePanelComponent } from './app/components/right-panel/home-panel/home-panel.component';
import { TrackTileComponent } from './app/components/right-panel/home-panel/track-tile/track-tile.component';
import { ArtistTileComponent } from './app/components/right-panel/home-panel/artist-tile/artist-tile.component';
import { PlaylistPanelComponent } from './app/components/right-panel/playlist-panel/playlist-panel.component';
import { TrackTableComponent } from './app/components/right-panel/playlist-panel/track-table/track-table.component';
import { TrackCellComponent } from './app/components/right-panel/playlist-panel/track-table/track-cell/track-cell.component';
import { AddPlaylistDialogComponent } from './app/components/dialogs/add-playlist-dialog/add-playlist-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DeletePlaylistDialogComponent } from './app/components/dialogs/delete-playlist-dialog/delete-playlist-dialog.component';
import { FollowedPanelComponent } from './app/components/right-panel/playlist-panel/followed-panel/followed-panel.component';
import { AlbumPanelComponent } from './app/components/right-panel/playlist-panel/album-panel/album-panel.component';
import { AlbumTableComponent } from './app/components/right-panel/playlist-panel/album-panel/album-table/album-table/album-table.component';
import { AlbumTrackCellComponent } from './app/components/right-panel/playlist-panel/album-panel/album-table/album-table/album-track-cell/album-track-cell/album-track-cell.component';

@NgModule({
  declarations : [
    AppComponent,
    MainComponent,
    LoginComponent,
    CallbackComponent,
    ErrorPageComponent,
    SpinnerDirective,
    PanelWrapperComponent,
    LeftPanelComponent,
    RightPanelComponent,
    ResizableDirective,
    BottomPanelComponent,
    ProgressBarComponent,
    DevicesWrapperComponent,
    HoverDirective,
    VolumeBarComponent,
    PopUpComponent,
    LyricsWrapperComponent,
    SafeHtmlPipe,
    QueueWrapperComponent,
    SearchBarComponent,
    ArtistResultComponent,
    TrackResultComponent,
    TrackResultComponent,
    AlbumResultComponent,
    ContextMenuComponent,
    OptionComponent,
    BaseComponent,
    ProfileBarComponent,
    LinkTileComponent,
    HomePanelComponent,
    TrackTileComponent,
    ArtistTileComponent,
    PlaylistPanelComponent,
    TrackTableComponent,
    TrackCellComponent,
    AddPlaylistDialogComponent,
    DeletePlaylistDialogComponent,
    FollowedPanelComponent,
    AlbumPanelComponent,
    AlbumTableComponent,
    AlbumTrackCellComponent
  ],
  imports : [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgbModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  providers : [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : GlobalHttpInterceptor,
      multi : true
    },
    SpotifyService
  ],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}

