import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vaga {
  id: number;
  titulo: string;
  descricao: string;
  empresa: string;
  localizacao: string;
  salario: number | null;
  status: 'ABERTA' | 'FECHADA';
  modalidade: 'REMOTO' | 'HIBRIDO' | 'PRESENCIAL';
  tipoContrato: 'CLT' | 'PJ' | 'FREELANCER';
  nivelSenioridade: 'JUNIOR' | 'PLENO' | 'SENIOR';
  requisitos: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})

export class VagaService {

  private API = 'http://localhost:3000/vagas';

  constructor(private http: HttpClient) { }

  getVagas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(this.API);
  }

  getVagaById(id: number): Observable<Vaga> {
    const url = `${this.API}/${id}`;
    return this.http.get<Vaga>(url);
  }

  saveVaga(vaga: Vaga): Observable<Vaga> {
    if (vaga.id && vaga.id !== 0) {
      const url = `${this.API}/${vaga.id}`;
      return this.http.put<Vaga>(url, vaga);
    } else {
      return this.http.post<Vaga>(this.API, vaga);
    }
  }

  deleteVaga(id: number): Observable<{}> {
    const url = `${this.API}/${id}`;
    return this.http.delete(url);
  }
}
