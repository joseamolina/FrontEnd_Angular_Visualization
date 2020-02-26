import { Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {VideosComponent} from "./videos/videos.component";
import {AuthGuard} from "./guards/auth.guards";

const appRoutes: Routes = [
  { path: '', component: VideosComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
