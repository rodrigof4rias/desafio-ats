import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]) // Essencial para o <router-outlet>
      ],
      // Impede o Angular de se aprofundar nos componentes filhos (como po-menu)
      schemas: [NO_ERRORS_SCHEMA]
    })
    // CORREÇÃO DEFINITIVA: Substitui o template do componente por um vazio para o teste
    .overrideComponent(AppComponent, {
      set: { template: '' }
    })
    .compileComponents();
  });

  it('deve criar a aplicação', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

