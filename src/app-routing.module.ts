import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './app/components/login/login.component';
import {MainComponent} from './app/components/main/main.component';
import {CallbackComponent} from './app/components/login/callback/callback.component';
import {ErrorPageComponent} from './app/components/login/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'error',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
