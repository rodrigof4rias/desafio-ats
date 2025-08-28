import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vaga {
  id?: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number | string | null;
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

  constructor(private http: HttpClient) { }

  private toNumberBR(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return value;

    const normalized = String(value)
      .replace(/[^\d,.-]/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');

    const n = Number(normalized);
    return Number.isNaN(n) ? null : n;
  }

  // Mantivemos apenas esta versão, que suporta paginação
  getVagas(page: number, pageSize: number): Observable<Vaga[]> {
    const url = `${this.apiUrl}?_page=${page}&_limit=${pageSize}`;
    return this.http.get<Vaga[]>(url);
  }

  getVagaById(id: number): Observable<Vaga> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vaga>(url);
  }

  saveVaga(vaga: Vaga) {
  const { id, createdAt, updatedAt, ...rest } = vaga as any;
  const payload = { ...rest, salary: this.toNumberBR(rest.salary) };

  return id && id !== 0
    ? this.http.put<Vaga>(`${this.apiUrl}/${id}`, payload)
    : this.http.post<Vaga>(this.apiUrl, payload);
  }


  deleteVaga(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
