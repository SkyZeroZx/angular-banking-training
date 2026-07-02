import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AccountSelectFieldComponent } from './account-select-field.component';
import { AccountService } from '@core/services/account/account.service';
import { AccountResponse } from '@core/interface';
import {
  click,
  dispatchFakeEvent,
  findComponent,
  findEl,
  findEls,
  getText,
} from '@app/spec-helpers/element.spec-helper';
import { pagedResponse } from '@app/spec-helpers/http.spec-helper';

const mockAccounts = pagedResponse<AccountResponse>(
  [
    {
      numeroCuenta: '478758',
      tipoCuenta: 'AHORRO',
      saldoInicial: 2000,
      estado: true,
      cliente: 'José Lema',
    },
    {
      numeroCuenta: '225487',
      tipoCuenta: 'CORRIENTE',
      saldoInicial: 500,
      estado: true,
      cliente: 'María López',
    },
  ],
  { size: 20 },
);

const mockPage2 = pagedResponse<AccountResponse>(
  [
    {
      numeroCuenta: '999001',
      tipoCuenta: 'AHORRO',
      saldoInicial: 100,
      estado: true,
      cliente: 'Carlos Ruiz',
    },
  ],
  {
    page: 2,
    size: 20,
    totalElements: 3,
    totalPages: 2,
    first: false,
  },
);

@Component({
  imports: [AccountSelectFieldComponent, ReactiveFormsModule],
  template: `<app-account-select [formControl]="ctrl" />`,
})
class TestHostComponent {
  readonly ctrl = new FormControl<string>('', { nonNullable: true });
}

describe('AccountSelectFieldComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let accountServiceSpy: { getAll: jest.Mock };

  beforeEach(async () => {
    accountServiceSpy = {
      getAll: jest.fn().mockReturnValue(of(mockAccounts)),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: AccountService, useValue: accountServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('loads accounts on init with page 1 and size 20', () => {
    expect(accountServiceSpy.getAll).toHaveBeenCalledWith({
      page: 1,
      size: 20,
    });
    expect(findEl(fixture, 'trigger').nativeElement).toBeTruthy();
  });

  it('renders account options with numeroCuenta and cliente label', async () => {
    click(fixture, 'trigger');
    await fixture.whenStable();

    const options = findEls(fixture, 'option');
    expect(options.length).toBe(2);
    expect(options[0].nativeElement.textContent).toContain('478758');
    expect(options[0].nativeElement.textContent).toContain('José Lema');
  });

  it('writes an external value to the inner control and shows the label', async () => {
    host.ctrl.setValue('478758');
    await fixture.whenStable();
    expect(getText(fixture, 'trigger')).toContain('478758');
    expect(getText(fixture, 'trigger')).toContain('José Lema');
  });

  it('propagates selected account to the outer FormControl', async () => {
    click(fixture, 'trigger');
    await fixture.whenStable();

    findEls(fixture, 'option')[1].nativeElement.click();
    await fixture.whenStable();

    expect(host.ctrl.value).toBe('225487');
  });

  it('fetches filtered accounts when search query changes', async () => {
    accountServiceSpy.getAll.mockReturnValue(
      of({ ...mockAccounts, content: [mockAccounts.content[0]] }),
    );

    click(fixture, 'trigger');
    await fixture.whenStable();

    const search = findEl(fixture, 'search').nativeElement as HTMLInputElement;
    search.value = '478';
    dispatchFakeEvent(search, 'input', true);

    await new Promise((r) => setTimeout(r, 350));
    await fixture.whenStable();

    expect(accountServiceSpy.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ search: '478' }),
    );
  });

  it('appends next-page accounts when nearEnd fires (infinite scroll)', async () => {
    // Return page 1 (2 items, totalPages=2) on first call, page 2 on second
    accountServiceSpy.getAll
      .mockReturnValueOnce(of({ ...mockAccounts, totalPages: 2 }))
      .mockReturnValueOnce(of(mockPage2));

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();

    findComponent(fixture, 'app-select-field').triggerEventHandler(
      'nearEnd',
      null,
    );
    await fixture.whenStable();

    expect(accountServiceSpy.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 }),
    );
  });

  it('disables the inner select when the FormControl is disabled', async () => {
    host.ctrl.disable();
    await fixture.whenStable();
    const trigger = findEl(fixture, 'trigger')
      .nativeElement as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
  });

  it('re-enables the inner select when the FormControl is re-enabled', async () => {
    host.ctrl.disable();
    await fixture.whenStable();
    host.ctrl.enable();
    await fixture.whenStable();
    const trigger = findEl(fixture, 'trigger')
      .nativeElement as HTMLButtonElement;
    expect(trigger.disabled).toBe(false);
  });
});
