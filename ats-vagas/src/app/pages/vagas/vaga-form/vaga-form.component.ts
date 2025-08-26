import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PoFieldModule, PoPageModule, PoNotificationService } from '@po-ui/ng-components';
import { VagaService, Vaga } from '../../../services/vaga.service';
import { StatusOptions, ModalidadeOptions, nivelSenioridadeOptions, tipoContratoOptions } from '../../../shared/vagas.enum'

@Component({
  selector: 'app-vaga-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoFieldModule,
    PoPageModule
  ],
  templateUrl: './vaga-form.component.html',
  styleUrls: ['./vaga-form.component.scss']
})
export class VagaFormComponent implements OnInit {

  pageTitle: string = 'Nova Vaga';

  vaga: Vaga = {
    id: 0,
    titulo: '',
    descricao: '',
    empresa: '',
    localizacao: '',
    salario: 0,
    status: 'ABERTA',
    modalidade: 'PRESENCIAL',
    tipoContrato: 'CLT',
    nivelSenioridade: 'JUNIOR',
    requisitos: '',
    createdAt: new Date(),
    updatedAt: new Date()
    };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vagaService: VagaService,
    private notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.checkIfIsEditing();
  }

  private checkIfIsEditing(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.pageTitle = 'Editar Vaga';
      const vagaId = parseInt(idParam, 10);
      this.vagaService.getVagaById(vagaId).subscribe(vaga => {
        if (vaga) {
          this.vaga = vaga;
        }
      });
    }
  }

  save(): void {
    this.vagaService.saveVaga(this.vaga).subscribe({
      next: () => {
        this.notification.success('Vaga salva com sucesso!');
        this.router.navigate(['/vagas']);
      },
      error: (err) => {
        this.notification.error('Erro ao salvar a vaga.');
        console.error('Erro:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/vagas']);
  }

  isFormInvalid(): boolean {
    return !this.vaga.titulo?.trim() || !this.vaga.descricao?.trim();
  }

  statusOptions = Object.entries(StatusOptions).map(([value, label]) => ({
    value,
    label
  }));

  modalidadeOptions = Object.entries(ModalidadeOptions).map(([value, label]) => ({
    value,
    label
  }));

  tipoContratoOptions = Object.entries(tipoContratoOptions).map(([value, label]) => ({
    value,
    label
  }));

  nivelSenioridadeOptions = Object.entries(nivelSenioridadeOptions).map(([value, label]) => ({
    value,
    label
  }));
}
