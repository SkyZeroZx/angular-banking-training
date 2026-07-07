import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContentComponent } from './content.component';
import { AuthService } from '@core/services/auth/auth.service';
import { AnalyticsAdapter } from '@core/services/analytics/analytics.adapter';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  const authServiceSpy = {
    user: jest.fn(() => null),
    logout: jest.fn(),
  };
  const analyticsAdapterSpy = {
    trackEvent: jest.fn(),
    trackPageView: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ContentComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AnalyticsAdapter, useValue: analyticsAdapterSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
