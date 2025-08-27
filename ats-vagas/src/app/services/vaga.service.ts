import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vaga {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number | null;
  status: 'OPEN' | 'CLOSED';
  workMode: 'REMOTE' | 'HYBRID' | 'ONSITE';
  contractType: 'CLT' | 'CONTRACTOR' | 'FREELANCER';
  seniorityLevel: 'JUNIOR' | 'MID' | 'SENIOR';
  requirements: string;
  createdAt: Date;
  updatedAt: Date;
}


@Injectable({
  providedIn: 'root'
})

export class VagaService {

  private apiUrl = 'http://localhost:3000/vagas';
  createVaga: any;

  constructor(private http: HttpClient) { }

  // Mantivemos apenas esta versão, que suporta paginação
  getVagas(page: number, pageSize: number): Observable<Vaga[]> {
    const url = `${this.apiUrl}?_page=${page}&_limit=${pageSize}`;
    return this.http.get<Vaga[]>(url);
  }

  getVagaById(id: number): Observable<Vaga> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vaga>(url);
  }

  saveVaga(vaga: Vaga): Observable<Vaga> {
    if (vaga.id && vaga.id !== 0) {
      const url = `${this.apiUrl}/${vaga.id}`;
      return this.http.put<Vaga>(url, vaga);
    } else {
      return this.http.post<Vaga>(this.apiUrl, vaga);
    }
  }

  deleteVaga(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
