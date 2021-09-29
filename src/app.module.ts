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
    SafeHtmlPipe
  ],
  imports : [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgbModule
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

