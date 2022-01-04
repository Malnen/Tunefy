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
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
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
import { ScrollMaskComponent } from './app/components/bottom-panel/pop-up/scroll-mask/scroll-mask.component';
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
import { ArtistPanelComponent } from './app/components/right-panel/artist-panel/artist-panel.component';
import { ArtistTopTracksTableComponent } from './app/components/right-panel/artist-panel/artist-top-tracks-table/artist-top-tracks-table.component';
import { ArtistTopTrackCellComponent } from './app/components/right-panel/artist-panel/artist-top-tracks-table/artist-top-track-cell/artist-top-track-cell.component';
import { AlbumTileComponent } from './app/components/right-panel/home-panel/album-tile/album-tile.component';
import { NavigationComponent } from './app/components/right-panel/navigation/navigation.component';
import { LocalPanelComponent } from './app/components/right-panel/local-panel/local-panel.component';
import { AddLocalSourceDialogComponent } from './app/components/dialogs/add-local-source-dialog/add-local-source-dialog.component';
import { StatsPanelComponent } from './app/components/right-panel/stats-panel/stats-panel.component';
import { ChartBarComponent } from './app/components/right-panel/stats-panel/chart/chart-bar/chart-bar.component';
import { TopArtistInfoComponent } from './app/components/right-panel/stats-panel/chart/top-artist-info/top-artist-info.component';
import { TopGenresInfoComponent } from './app/components/right-panel/stats-panel/chart/top-genres-info/top-genres-info.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NonPremiumScreenComponent } from './app/components/login/non-premium-screen/non-premium-screen.component';
import { ChartHintComponent } from './app/components/right-panel/stats-panel/chart/chart-hint/chart-hint.component';
import { TopAlbumInfoComponent } from './app/components/right-panel/stats-panel/chart/top-album-info/top-album-info.component';
import { ChartComponent } from './app/components/right-panel/stats-panel/chart/chart.component';
import { NotAllowedScreenComponent } from './app/components/login/not-allowewd-screen/not-allowed-screen.component';
import { SubMenuComponent } from './app/components/context-menu/sub-menu/sub-menu.component';
import { EditPlaylistDialogComponent } from './app/components/dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangePlaylistImageDialogComponent } from './app/components/dialogs/change-playlist-image-dialog/change-playlist-image-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResizeService } from './app/services/resize-service/resize.service';
import { DiscoverPanelComponent } from './app/components/right-panel/discover-panel/discover-panel.component';
import { DiscoverService } from './app/services/discover/discover.service';
import { PlaylistService } from './app/services/playlist-service/playlist.service';
import { LyricsWrapperComponent } from './app/components/bottom-panel/pop-up/lyrics-wrapper/lyrics-wrapper.component';
import { AudioFeaturesComponent } from './app/components/bottom-panel/pop-up/audio-features/audio-features.component';
import { AufioFeatureBarComponent } from './app/components/bottom-panel/pop-up/audio-features/aufio-feature-bar/aufio-feature-bar.component';
import { SwitcherComponent } from './app/components/switcher/switcher.component';
import { HorizontalChartComponent } from './app/components/right-panel/playlist-panel/horizontal-chart/horizontal-chart.component';
import { HorizontalBarComponent } from './app/components/right-panel/playlist-panel/horizontal-chart/horizontal-bar/horizontal-bar.component';
import { HorizontalChartInfoComponent } from './app/components/right-panel/playlist-panel/horizontal-chart/horizontal-chart-info/horizontal-chart-info.component';

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
    ScrollMaskComponent,
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
    AlbumTrackCellComponent,
    ArtistPanelComponent,
    ArtistTopTracksTableComponent,
    ArtistTopTrackCellComponent,
    AlbumTileComponent,
    NavigationComponent,
    LocalPanelComponent,
    AddLocalSourceDialogComponent,
    StatsPanelComponent,
    ChartComponent,
    ChartBarComponent,
    TopArtistInfoComponent,
    TopAlbumInfoComponent,
    TopGenresInfoComponent,
    ChartHintComponent,
    NonPremiumScreenComponent,
    NotAllowedScreenComponent,
    SubMenuComponent,
    EditPlaylistDialogComponent,
    ChangePlaylistImageDialogComponent,
    DiscoverPanelComponent,
    LyricsWrapperComponent,
    AudioFeaturesComponent,
    AufioFeatureBarComponent,
    SwitcherComponent,
    HorizontalChartComponent,
    HorizontalBarComponent,
    HorizontalChartInfoComponent
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  providers : [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : GlobalHttpInterceptor,
      multi : true
    },
    SpotifyService,
    MatDatepickerModule,
    ResizeService,
    DiscoverService,
    PlaylistService
  ],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}

