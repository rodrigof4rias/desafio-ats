import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PoPageModule,
  PoTableModule,
  PoTableColumn,
  PoPageAction,
  PoTableAction,
  PoDialogService,
  PoNotificationService,
  PoLoadingModule,
  PoSearchModule,
  PoModalComponent,
  PoModalModule,
  PoFieldModule,
  PoButtonModule,
  PoSelectOption
} from '@po-ui/ng-components';
import { VagaService, Vaga } from '../../../services/vaga.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vagas-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoTableModule,
    PoLoadingModule,
    PoSearchModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule
  ],
  templateUrl: './vagas-list.component.html',
  styleUrls: ['./vagas-list.component.scss']
})
export class VagasListComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  vagas: Vaga[] = [];
  filteredVagas: Vaga[] = [];
  columns: PoTableColumn[] = [];
  pageActions: PoPageAction[] = [];
  tableActions: PoTableAction[] = [];
  isLoading: boolean = false;

  novaVaga: Vaga = this.createBlankVaga();

  readonly statusOptions: PoSelectOption[] = [
    { label: 'Aberta', value: 'OPEN' },
    { label: 'Fechada', value: 'CLOSED' }
  ];

  readonly workModeOptions: PoSelectOption[] = [
    { label: 'Remoto', value: 'REMOTE' },
    { label: 'Híbrido', value: 'HYBRID' },
    { label: 'Presencial', value: 'ONSITE' }
  ];

  readonly contractTypeOptions: PoSelectOption[] = [
    { label: 'CLT', value: 'CLT' },
    { label: 'PJ', value: 'CONTRACTOR' },
    { label: 'Freelancer', value: 'FREELANCER' }
  ];

  readonly seniorityLevelOptions: PoSelectOption[] = [
    { label: 'Júnior', value: 'JUNIOR' },
    { label: 'Pleno', value: 'MID' },
    { label: 'Sênior', value: 'SENIOR' }
  ];

  private page = 1;
  private readonly pageSize = 5;
  hasNextPage = true;
  private currentFilter = '';

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

  private createBlankVaga(): Vaga {
    return {
      id: 0,
      title: '',
      description: '',
      company: '',
      location: '',
      salary: null,
      status: 'OPEN',
      workMode: 'REMOTE',
      contractType: 'CLT',
      seniorityLevel: 'JUNIOR',
      requirements: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private setupPage(): void {
    this.columns = [
      { property: 'id', label: 'Código', width: '100px' },
      { property: 'title', label: 'Cargo' }
    ];
    this.pageActions = [
      { label: 'Nova Vaga', action: this.abrirModalNovaVaga.bind(this), icon: 'po-icon-plus' }
    ];
    this.tableActions = [
      { label: 'Editar', action: this.editarVaga.bind(this), icon: 'po-icon-edit' },
      { label: 'Excluir', action: this.excluirVaga.bind(this), icon: 'po-icon-delete', type: 'danger' }
    ];
  }

  salvarVaga(): void {
    this.isLoading = true;
    this.vagaService.saveVaga(this.novaVaga).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.notification.success('Vaga cadastrada com sucesso!');
        this.poModal.close();
        this.loadVagas();
      },
      error: (err) => {
        this.notification.error('Erro ao cadastrar a vaga.');
        console.error(err);
      }
    });
  }

  private abrirModalNovaVaga(): void {
    this.novaVaga = this.createBlankVaga();
    this.poModal.open();
  }

  private loadVagas(): void {
    this.page = 1;
    this.vagas = [];
    this.hasNextPage = true;
    this.loadMoreVagas();
  }

  loadMoreVagas(): void {
    if (!this.hasNextPage || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.vagaService.getVagas(this.page, this.pageSize).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: vagasRecebidas => {
        this.vagas = [...this.vagas, ...vagasRecebidas];
        this.filterAction(this.currentFilter);
        this.hasNextPage = vagasRecebidas.length === this.pageSize;
        this.page++;
      },
      error: err => {
        this.notification.error('Erro ao carregar as vagas.');
        console.error(err);
      }
    });
  }

  filterAction(filter: string = ''): void {
    this.currentFilter = filter.toLowerCase();
    this.filteredVagas = this.vagas.filter(vaga =>
      vaga.title.toLowerCase().includes(this.currentFilter)
    );
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
          this.loadVagas();
        });
      }
    });
  }
}
