import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VagaFormComponent } from './vaga-form.component';

describe('VagaFormComponent', () => {
  let component: VagaFormComponent;
  let fixture: ComponentFixture<VagaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VagaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VagaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
