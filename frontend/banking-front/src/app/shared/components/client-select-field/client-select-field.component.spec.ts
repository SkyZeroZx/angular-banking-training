import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ClientSelectFieldComponent } from './client-select-field.component';
import { ClientService } from '@core/services/client/client.service';
import { ClientResponse } from '@core/interface';
import {
  click,
  findEl,
  findEls,
  getText,
} from '@app/spec-helpers/element.spec-helper';
import { pagedResponse } from '@app/spec-helpers/http.spec-helper';

const mockClients = pagedResponse<ClientResponse>(
  [
    {
      clienteId: 'c1',
      nombre: 'José Lema',
      genero: 'MASCULINO',
      edad: 30,
      identificacion: '1234567890',
      direccion: 'Otavalo',
      telefono: '098254785',
      estado: true,
    },
    {
      clienteId: 'c2',
      nombre: 'María López',
      genero: 'FEMENINO',
      edad: 25,
      identificacion: '0987654321',
      direccion: 'Quito',
      telefono: '099111222',
      estado: true,
    },
  ],
  { size: 20 },
);

@Component({
  imports: [ClientSelectFieldComponent, ReactiveFormsModule],
  template: `<app-client-select [formControl]="ctrl" />`,
})
class TestHostComponent {
  readonly ctrl = new FormControl<string>('', { nonNullable: true });
}

describe('ClientSelectFieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let clientServiceSpy: { getAll: jest.Mock };

  beforeEach(async () => {
    clientServiceSpy = { getAll: jest.fn().mockReturnValue(of(mockClients)) };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: ClientService, useValue: clientServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('loads clients on init and renders the select trigger', () => {
    expect(clientServiceSpy.getAll).toHaveBeenCalledWith({ page: 1, size: 20 });
    expect(findEl(fixture, 'trigger').nativeElement).toBeTruthy();
  });

  it('writes an external value to the inner control', async () => {
    host.ctrl.setValue('c1');
    await fixture.whenStable();
    expect(getText(fixture, 'trigger')).toContain('José Lema');
  });

  it('propagates inner selection to the outer FormControl', async () => {
    click(fixture, 'trigger');
    await fixture.whenStable();

    findEls(fixture, 'option')[1].nativeElement.click();
    await fixture.whenStable();

    expect(host.ctrl.value).toBe('c2');
  });
});
