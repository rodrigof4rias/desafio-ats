import { Routes } from '@angular/router';
import { VagasListComponent } from './pages/vagas/vagas-list/vagas-list.component';
import { HomeComponent } from './pages/vagas/home/home.component';
import { RelatoriosComponent } from './pages/relatorios/relatorio.component';

export const routes: Routes = [
    // rota raiz para '/home'
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // rota para o componente Home
    { path: 'home', component: HomeComponent },

    // rota para a lista de vagas
    { path: 'vagas', component: VagasListComponent },

    // rota para o componente de relatórios
    { path: 'relatorios', component: RelatoriosComponent }
];
