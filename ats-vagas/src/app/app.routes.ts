import { Routes } from '@angular/router';
import { VagasListComponent } from './pages/vagas/vagas-list/vagas-list.component';
import { HomeComponent } from './pages/vagas/home/home.component';

export const routes: Routes = [
    // Redireciona a rota raiz para '/home'
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Define a rota para o componente Home
    { path: 'home', component: HomeComponent },

    // Mantém a rota para a lista de vagas
    { path: 'vagas', component: VagasListComponent }
];
