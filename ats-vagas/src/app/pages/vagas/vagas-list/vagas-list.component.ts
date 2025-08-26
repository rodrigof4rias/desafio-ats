import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PoPageModule, PoTableModule, PoTableColumn, PoPageAction, PoTableAction } from '@po-ui/ng-components';

import { VagaService, Vaga } from '../../../services/vaga.service';

@Component({
  selector: 'app-vagas-list',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoTableModule],
  templateUrl: './vagas-list.component.html',
  styleUrls: ['./vagas-list.component.scss']
})

export class VagasListComponent implements OnInit {


  vagas: Vaga[] = [];
  columns: PoTableColumn[] = [];
  pageActions: PoPageAction[] = [];
  tableActions: PoTableAction[] = [];

  constructor(private vagaService: VagaService, private router: Router) {}

  ngOnInit(): void {
    this.setupPage();
    this.loadVagas();
  }

  private setupPage(): void {
    this.columns = [
      { property: 'id', label: 'Código' },
      { property: 'titulo', label: 'Cargo' }
    ];

    this.pageActions = [
      { label: 'Nova Vaga', action: this.navegarParaNovaVaga.bind(this), icon: 'po-icon-plus' }
    ];

    this.tableActions = [
      { label: 'Editar', action: this.editarVaga.bind(this), icon: 'po-icon-edit' },
      { label: 'Excluir', action: this.excluirVaga.bind(this), icon: 'po-icon-delete', type: 'danger' }
    ];
  }

  private loadVagas(): void {
    this.vagaService.getVagas().subscribe(vagas => {
      this.vagas = vagas;
    });
  }

  private navegarParaNovaVaga(): void {
    this.router.navigate(['/vagas/novo']);
  }

  private editarVaga(vaga: Vaga): void {
    this.router.navigate(['/vagas/editar', vaga.id]);
  }

  private excluirVaga(vaga: Vaga): void {
    console.log('Excluir vaga:', vaga);
    alert(`Tem certeza que deseja excluir a vaga: ${vaga.titulo}?`);
  }
}
