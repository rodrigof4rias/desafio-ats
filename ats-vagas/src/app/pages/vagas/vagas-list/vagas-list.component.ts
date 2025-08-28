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
import { StatusOptions, contractTypeOptions, seniorityLevelOptions, workModeOptions } from '../../../shared/vagas.enum'

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

  public StatusOptions = StatusOptions;

  vagas: Vaga[] = [];
  filteredVagas: Vaga[] = [];
  columns: PoTableColumn[] = [];
  pageActions: PoPageAction[] = [];
  tableActions: PoTableAction[] = [];
  isLoading = false;
  public isEditing = false;

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

    // Criar Vaga
  private abrirModalNovaVaga(): void {
    this.isEditing = false;
    this.novaVaga = this.createBlankVaga();
    this.poModal.open();
  }

  // Edição
  private abrirModalEditarVaga(vaga: Vaga): void {
    this.isEditing = true;

    this.novaVaga = { ...vaga };
    this.poModal.open();
  }

  salvarVaga(): void {
  this.isLoading = true;
  this.vagaService.saveVaga(this.novaVaga)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe({
      next: (saved: Vaga) => {
        if (this.isEditing) {
          const idx = this.vagas.findIndex(v => v.id === saved.id);
          if (idx > -1) this.vagas[idx] = { ...saved };
        } else {
          this.vagas = [ saved, ...this.vagas ];
        }

        this.filterAction(this.currentFilter);

        this.notification.success(this.isEditing ? 'Vaga atualizada!' : 'Vaga cadastrada!');
        this.poModal.close();
      },
      error: (err: unknown) => {
        this.notification.error('Erro ao salvar a vaga.');
        console.error(err);
      }
    });
}
  private loadVagas(): void {
    this.page = 1;
    this.vagas = [];
    this.hasNextPage = true;
    this.loadMoreVagas();
  }

  loadMoreVagas(): void {
    if (!this.hasNextPage || this.isLoading) return;

    this.isLoading = true;
    this.vagaService.getVagas(this.page, this.pageSize).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (vagasRecebidas: Vaga[]) => {
        this.vagas = [...this.vagas, ...vagasRecebidas];
        this.filterAction(this.currentFilter);
        this.hasNextPage = vagasRecebidas.length === this.pageSize;
        this.page++;
      },
      error: (err: unknown) => {
        this.notification.error('Erro ao carregar as vagas.');
        console.error(err);
      }
    });
  }

  private setupPage(): void {
    this.columns = [
      { property: 'id', label: 'Código' },
      { property: 'title', label: 'Cargo' },
      { property: 'description', label: 'Descrição' },
      {
        property: 'seniorityLevel',
        label: 'Senioridade',
        type: 'label',
        labels: [
          { value: 'JUNIOR', label: seniorityLevelOptions.JUNIOR },
          { value: 'MID',    label: seniorityLevelOptions.MID },
          { value: 'SENIOR', label: seniorityLevelOptions.SENIOR }
        ]
      },
      { property: 'company', label: 'Empresa' },
      { property: 'location', label: 'Local' },
      { property: 'salary', label: 'Salário', type: 'currency', format: 'BRL' },
      {
        property: 'workMode',
        label: 'Modalidade',
        type: 'label',
        labels: [
          { value: 'REMOTE',  label: workModeOptions.REMOTO },
          { value: 'HYBRID',  label: workModeOptions.HYBRID },
          { value: 'ONSITE',  label: workModeOptions.ONSITE }
        ]
      },
      {
        property: 'contractType',
        label: 'Tipo de Contrato',
        type: 'label',
        labels: [
          { value: 'CLT',         label: contractTypeOptions.CLT },
          { value: 'CONTRACTOR',  label: contractTypeOptions.CONTRACTOR },
          { value: 'FREELANCER',  label: contractTypeOptions.FREELANCER }
        ]
      },
      {
        property: 'status',
        label: 'Status',
        type: 'label',
        labels: [
          { value: 'OPEN',   label: StatusOptions.OPEN,   color: '#86c76a' },
          { value: 'CLOSED', label: StatusOptions.CLOSED, color: '#d35454' }
        ]
      },
    ];

    this.pageActions = [
      { label: 'Nova Vaga', action: this.abrirModalNovaVaga.bind(this), icon: 'po-icon-plus' }
    ];
    this.tableActions = [
      { label: 'Editar', action: this.abrirModalEditarVaga.bind(this), icon: 'po-icon-edit' },
      { label: 'Excluir', action: this.excluirVaga.bind(this), icon: 'po-icon-delete', type: 'danger' }
    ];
  }

  // filtro local
  filterAction(filter: string = ''): void {
    this.currentFilter = (filter ?? '').toString().toLowerCase();
    this.filteredVagas = this.vagas.filter(v =>
      (v.title ?? '').toLowerCase().includes(this.currentFilter)
    );
  }

  private excluirVaga(vaga: Vaga): void {
    const id = vaga.id;
    if (id == null) {
      this.notification.warning('Registro sem ID, não é possível excluir.');
      return;
    }

    this.dialogService.confirm({
      title: 'Confirmar Exclusão',
      message: `Você tem certeza que deseja excluir a vaga "${vaga.title}"?`,
      confirm: () => {
        this.vagaService.deleteVaga(id).subscribe({
          next: () => {
            this.notification.success('Vaga excluída com sucesso!');
            this.loadVagas();
          },
          error: (err: unknown) => {
            this.notification.error('Erro ao excluir a vaga.');
            console.error(err);
          }
        });
      }
    });
  }
}
