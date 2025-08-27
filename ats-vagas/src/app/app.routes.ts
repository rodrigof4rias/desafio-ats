import { Routes } from '@angular/router';
import { VagasListComponent } from './pages/vagas/vagas-list/vagas-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'vagas', pathMatch: 'full' },
    { path: 'vagas', component: VagasListComponent }
];
