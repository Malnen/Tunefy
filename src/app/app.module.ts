import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {LoginComponent} from './login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CallbackComponent} from './login/callback/callback/callback.component';
import {ErrorPageComponent} from './login/error-page/error-page/error-page.component';
import {GlobalHttpInterceptor} from './login/service/global-http-interceptor/global-http-interceptor';
import {SpotifyService} from './login/service/spotify.service';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    CallbackComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: GlobalHttpInterceptor,
    multi: true,
  }, SpotifyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
