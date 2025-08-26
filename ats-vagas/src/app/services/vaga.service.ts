import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vaga {
  id: number;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class VagaService {

  // API simulada pelo json-server
  private apiUrl = 'http://localhost:3000/vagas';
  constructor(private http: HttpClient) { }

  getVagas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(this.apiUrl);
  }

  getVagaById(id: number): Observable<Vaga> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Vaga>(url);
  }

  saveVaga(vaga: Vaga): Observable<Vaga> {
    if (vaga.id && vaga.id !== 0) {
      // faz uma requisição PUT
      const url = `${this.apiUrl}/${vaga.id}`;
      return this.http.put<Vaga>(url, vaga);
    } else {
      // faz uma requisição POST
      return this.http.post<Vaga>(this.apiUrl, vaga);
    }
  }

  deleteVaga(id: number): Observable<{}> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
