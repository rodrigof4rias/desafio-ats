import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]) // necessário pelo routeroutlet no template
      ],
      // impede o Angular de se aprofundar nos componentes filhos (como po-menu)
      schemas: [NO_ERRORS_SCHEMA]
    })
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

