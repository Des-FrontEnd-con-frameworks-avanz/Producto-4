import { Routes } from '@angular/router';
import { HomePageComponent } from '@pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent }, // Ruta inicial
  { path: 'home', component: HomePageComponent },
  { path: '**', redirectTo: '' } // Redirección por si escriben algo mal
];
