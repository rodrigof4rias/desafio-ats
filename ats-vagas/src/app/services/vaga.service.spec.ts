import { TestBed } from '@angular/core/testing';
// Importe as novas funções e o controller de teste
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { VagaService } from './vaga.service';

describe('VagaService', () => {
  let service: VagaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // O array 'imports' não é mais necessário para o HttpClient
      providers: [
        // Adicione as novas funções provedoras aqui
        provideHttpClient(),
        provideHttpClientTesting(),
        VagaService
      ]
    });
    service = TestBed.inject(VagaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Garante que não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

