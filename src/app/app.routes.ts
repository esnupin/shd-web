import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Post } from './components/posts/posts';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'posts',
    component: Post,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];