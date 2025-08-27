import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PoPageModule, PoTableModule, PoTableColumn, PoPageAction, PoTableAction, PoDialogService, PoNotificationService, PoLoadingModule, PoPageFilter } from '@po-ui/ng-components';
import { VagaService, Vaga } from '../../../services/vaga.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vagas-list',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoTableModule, PoLoadingModule],
  templateUrl: './vagas-list.component.html',
  styleUrls: ['./vagas-list.component.scss']
})
export class VagasListComponent implements OnInit {

  vagas: Vaga[] = [];
  filteredVagas: Vaga[] = []; // lista para os itens filtrados
  columns: PoTableColumn[] = [];
  pageActions: PoPageAction[] = [];
  tableActions: PoTableAction[] = [];
  isLoading: boolean = false;

  // paginação
  private page = 1;
  private readonly pageSize = 5; // aqui mostra quantos itens por pagina, no caso 5
  hasNextPage = true; // botão de "carregar mais"
  private currentFilter = ''; // **NOVO**: Guarda o filtro atual para ser reaplicado

  // configurações do filtro
  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    placeholder: 'Buscar por cargo'
  };

  constructor(
    private vagaService: VagaService,
    private router: Router,
    private dialogService: PoDialogService,
    private notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.setupPage();
    this.loadVagas();
  }

  // popular as duas listas
  private loadVagas(): void {
    this.page = 1;
    this.vagas = [];
    // O filteredVagas será limpo dentro do loadMoreVagas
    this.hasNextPage = true;
    this.loadMoreVagas();
  }

  // Crie a função que carrega os dados
  loadMoreVagas(): void {
    if (!this.hasNextPage || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.vagaService.getVagas(this.page, this.pageSize).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: vagasRecebidas => {
        this.vagas = [...this.vagas, ...vagasRecebidas]; // novos itens à lista existente
        this.filterAction(this.currentFilter); // **MUDANÇA**: Re-aplica o filtro atual sobre a lista maior
        this.hasNextPage = vagasRecebidas.length === this.pageSize; // checa se ainda há mais páginas
        this.page++;
      },
      error: err => {
        this.notification.error('Erro ao carregar as vagas.');
        console.error(err);
      }
    });
  }

  private setupPage(): void {
    this.columns = [
      { property: 'id', label: 'Código' },
      { property: 'title', label: 'Cargo' }
    ];
    this.pageActions = [
      { label: 'Nova Vaga', action: this.navegarParaNovaVaga.bind(this), icon: 'po-icon-plus' }
    ];
    this.tableActions = [
      { label: 'Editar', action: this.editarVaga.bind(this), icon: 'po-icon-edit' },
      { label: 'Excluir', action: this.excluirVaga.bind(this), icon: 'po-icon-delete', type: 'danger' }
    ];
  }

  // função de filtro
  filterAction(filter: string = ''): void { // Permite ser chamada sem parâmetro
    this.currentFilter = filter.toLowerCase(); // Salva o filtro atual
    this.filteredVagas = this.vagas.filter(vaga =>
      vaga.title.toLowerCase().includes(this.currentFilter)
    );
  }

  private navegarParaNovaVaga(): void {
    this.router.navigate(['/vagas/novo']);
  }

  private editarVaga(vaga: Vaga): void {
    this.router.navigate(['/vagas/editar', vaga.id]);
  }

  private excluirVaga(vaga: Vaga): void {
    this.dialogService.confirm({
      title: 'Confirmar Exclusão',
      message: `Você tem certeza que deseja excluir a vaga "${vaga.title}"?`,
      confirm: () => {
        this.vagaService.deleteVaga(vaga.id).subscribe(() => {
          this.notification.success('Vaga excluída com sucesso!');
          this.loadVagas(); // Recarrega a lista
        });
      }
    });
  }
}
