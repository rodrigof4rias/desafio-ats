import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoPageModule, PoWidgetModule, PoChartModule, PoChartSerie, PoLoadingModule } from '@po-ui/ng-components';
import { VagaService, Vaga } from '../../services/vaga.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoWidgetModule, PoChartModule, PoLoadingModule],
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss']
})
export class RelatoriosComponent implements OnInit {

  isLoading = true;

  totalVagas = 0;
  vagasAbertas = 0;
  vagasRemotas = 0;
  vagasCLT = 0;

  vagasPorStatusChart: PoChartSerie[] = [];

  constructor(private vagaService: VagaService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.isLoading = true;
    this.vagaService.getAllVagas().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(vagas => {
      this.processarDados(vagas);
    });
  }

  private processarDados(vagas: Vaga[]): void {
    // totais para os widgets
    this.totalVagas = vagas.length;
    this.vagasAbertas = vagas.filter(v => v.status === 'OPEN').length;
    this.vagasRemotas = vagas.filter(v => v.workMode === 'REMOTE').length;
    this.vagasCLT = vagas.filter(v => v.contractType === 'CLT').length;

    // prepata os dados para o gráfico
    const vagasFechadas = this.totalVagas - this.vagasAbertas;
    this.vagasPorStatusChart = [
      { label: 'Abertas', data: this.vagasAbertas, color: 'color-10' },
      { label: 'Fechadas', data: vagasFechadas, color: 'color-07' }
    ];
  }
}
