import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page at root URL
  { path: 'dashboard', component: DashboardComponent },
  // Add more routes as needed
];
