import { Routes } from '@angular/router';
import { VagasListComponent } from './pages/vagas/vagas-list/vagas-list.component';
import { VagaFormComponent } from './pages/vagas/vaga-form/vaga-form.component';

export const routes: Routes = [
    // redireciona para a lista de vagas
    { path: '', redirectTo: 'vagas', pathMatch: 'full' },

    // lista de vagas
    { path: 'vagas', component: VagasListComponent },

    // criar uma nova vaga
    { path: 'vagas/novo', component: VagaFormComponent },

    // editar uma vaga existente, passando o ID como parâmetro
    { path: 'vagas/editar/:id', component: VagaFormComponent }
];
