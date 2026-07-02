import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth/auth.service';
import {
  expectContainedText,
  findComponents,
} from '@app/spec-helpers/element.spec-helper';
import { AnalyticsAdapter } from '@core/services/analytics/analytics.adapter';

@Component({ template: '<p data-testid="home">Home</p>' })
class FakeHomeComponent {}

describe('LoginComponent', () => {
  let authStub: { setToken: jest.Mock; login: jest.Mock };
  let harness: RouterTestingHarness;

  const analyticsAdapterSpy = {
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    authStub = {
      setToken: jest.fn(),
      login: jest
        .fn()
        .mockReturnValue(
          of({ token: 'test-token', username: 'admin', role: 'ADMIN' }),
        ),
    };

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: FakeHomeComponent },
          { path: 'login', component: LoginComponent },
        ]),
        { provide: AuthService, useValue: authStub },
        { provide: AnalyticsAdapter, useValue: analyticsAdapterSpy },
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('should create the component', async () => {
    const component = await harness.navigateByUrl('/login', LoginComponent);
    expect(component).toBeTruthy();
  });

  it('should render the page title', async () => {
    await harness.navigateByUrl('/login', LoginComponent);
    expectContainedText(harness.fixture, 'BANCO');
  });

  it('should render username and password inputs', async () => {
    await harness.navigateByUrl('/login', LoginComponent);
    expect(findComponents(harness.fixture, 'app-input-field')).toHaveLength(2);
  });

  it('should mark form as touched when submitted with empty fields', async () => {
    const component = await harness.navigateByUrl('/login', LoginComponent);

    component.onSubmit();
    await harness.fixture.whenStable();

    expect(component.form.touched).toBe(true);
    expect(authStub.login).not.toHaveBeenCalled();
  });

  it('should call auth.login with form values on valid submit', async () => {
    const component = await harness.navigateByUrl('/login', LoginComponent);

    component.form.setValue({ username: 'admin', password: 'secret' });
    component.onSubmit();
    await harness.fixture.whenStable();

    expect(authStub.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'secret',
    });
  });

  it('should store the token and navigate to / after successful login', async () => {
    const component = await harness.navigateByUrl('/login', LoginComponent);

    component.form.setValue({ username: 'admin', password: 'secret' });
    component.onSubmit();
    await harness.fixture.whenStable();

    expect(authStub.setToken).toHaveBeenCalledWith('test-token');
    expect(TestBed.inject(Router).url).toBe('/');
  });

  it('should show an error message when login fails', async () => {
    authStub.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
    const component = await harness.navigateByUrl('/login', LoginComponent);

    component.form.setValue({ username: 'wrong', password: 'wrong' });
    component.onSubmit();
    await harness.fixture.whenStable();

    expect(component.error()).toBeTruthy();
    expect(component.loading()).toBe(false);
  });
});
