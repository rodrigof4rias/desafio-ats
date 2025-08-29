import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { VagasListComponent } from './vagas-list.component';
import { VagaService, Vaga } from '../../../services/vaga.service';
import { PoDialogService, PoNotificationService } from '@po-ui/ng-components';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// mocks
const vagaServiceMock = {
  getVagas: jasmine.createSpy('getVagas').and.returnValue(of([])),
  saveVaga: jasmine.createSpy('saveVaga').and.returnValue(of({})),
  deleteVaga: jasmine.createSpy('deleteVaga').and.returnValue(of({}))
};
const routerMock = { navigate: jasmine.createSpy('navigate') };
const dialogServiceMock = jasmine.createSpyObj('PoDialogService', ['confirm']);
const notificationServiceMock = { success: jasmine.createSpy('success'), error: jasmine.createSpy('error') };


describe('VagasListComponent', () => {
  let component: VagasListComponent;
  let fixture: ComponentFixture<VagasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ VagasListComponent, FormsModule ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: VagaService, useValue: vagaServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: PoNotificationService, useValue: notificationServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideProvider(PoDialogService, { useValue: dialogServiceMock })
    .compileComponents();

    fixture = TestBed.createComponent(VagasListComponent);
    component = fixture.componentInstance;
    component.poModal = { open: jasmine.createSpy('open'), close: jasmine.createSpy('close') } as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    Object.values(vagaServiceMock).forEach(spy => spy.calls.reset());
    dialogServiceMock.confirm.calls.reset();
    notificationServiceMock.success.calls.reset();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar loadVagas no início', () => {
    expect(vagaServiceMock.getVagas).toHaveBeenCalled();
  });

  it('deve criar uma nova vaga ao salvar', fakeAsync(() => {
    component.isEditing = false;
    const novaVaga: Vaga = component['createBlankVaga']();
    vagaServiceMock.saveVaga.and.returnValue(of(novaVaga));
    component.novaVaga = novaVaga;

    component.salvarVaga();
    tick();

    expect(vagaServiceMock.saveVaga).toHaveBeenCalledWith(novaVaga);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Vaga cadastrada!');
  }));

  it('deve editar uma vaga existente ao salvar', fakeAsync(() => {
    component.isEditing = true;
    const vagaEditada: Vaga = { id: 1, title: 'Vaga Editada', description: '', company: '', location: '', salary: null, status: 'OPEN', workMode: 'REMOTE', contractType: 'CLT', seniorityLevel: 'JUNIOR', requirements: '', createdAt: new Date(), updatedAt: new Date() };
    vagaServiceMock.saveVaga.and.returnValue(of(vagaEditada));
    component.novaVaga = vagaEditada;

    component.salvarVaga();
    tick();

    expect(vagaServiceMock.saveVaga).toHaveBeenCalledWith(vagaEditada);
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Vaga atualizada!');
  }));

  it('deve chamar deleteVaga quando o usuário confirma a exclusão', fakeAsync(() => {
      const vagaParaExcluir: Vaga = { id: 1, title: 'Vaga Teste', description: '', company: '', location: '', salary: null, status: 'OPEN', workMode: 'REMOTE', contractType: 'CLT', seniorityLevel: 'JUNIOR', requirements: '', createdAt: new Date(), updatedAt: new Date() };

      // chama o componente
      component['excluirVaga'](vagaParaExcluir);

      // verifica se confirmação foi chamado
      expect(dialogServiceMock.confirm).toHaveBeenCalled();

      // Confirm que foi passada para o diálogo
      const confirmCallback = dialogServiceMock.confirm.calls.mostRecent().args[0].confirm;

      // executa manualmente a função de confirmação (simulando o clique do usuário)
      confirmCallback();
      tick(); // avança o tempo para resolver o subscribe dentro da função

      // verifica os resultados
      expect(vagaServiceMock.deleteVaga).toHaveBeenCalledWith(1);
      expect(notificationServiceMock.success).toHaveBeenCalledWith('Vaga excluída com sucesso!');
  }));
});

