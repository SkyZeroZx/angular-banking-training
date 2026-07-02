import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { PaginatorComponent } from './paginator.component';
import {
  click,
  findEl,
  getText,
  queryByCss,
} from '../../../spec-helpers/element.spec-helper';

@Component({
  imports: [PaginatorComponent],
  template: `
    <app-paginator
      [page]="page()"
      [size]="size()"
      [totalElements]="totalElements()"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class TestHostComponent {
  page = signal(1);
  size = signal(10);
  totalElements = signal(100);
  emittedPage: number | null = null;

  onPageChange(p: number): void {
    this.emittedPage = p;
  }
}

describe('PaginatorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('displays the correct pagination range on the first page', () => {
    const info = getText(fixture, 'paginator-info');
    expect(info).toContain('1');
    expect(info).toContain('10');
    expect(info).toContain('100');
  });

  it('displays "Sin resultados" when totalElements is 0', async () => {
    host.totalElements.set(0);
    await fixture.whenStable();
    expect(getText(fixture, 'paginator-info')).toContain('Sin resultados');
  });

  it('displays page counter as "current page / totalPages"', async () => {
    host.page.set(3);
    await fixture.whenStable();
    const pages = getText(fixture, 'paginator-pages');
    expect(pages).toContain('3');
    expect(pages).toContain('10');
  });

  it('disables first and prev buttons on the first page', () => {
    expect(findEl(fixture, 'btn-first').nativeElement.disabled).toBe(true);
    expect(findEl(fixture, 'btn-prev').nativeElement.disabled).toBe(true);
  });

  it('enables next and last buttons when not on the last page', () => {
    expect(findEl(fixture, 'btn-next').nativeElement.disabled).toBe(false);
    expect(findEl(fixture, 'btn-last').nativeElement.disabled).toBe(false);
  });

  it('disables next and last buttons on the last page', async () => {
    host.page.set(10);
    await fixture.whenStable();
    expect(findEl(fixture, 'btn-next').nativeElement.disabled).toBe(true);
    expect(findEl(fixture, 'btn-last').nativeElement.disabled).toBe(true);
  });

  it('enables first and prev buttons when not on the first page', async () => {
    host.page.set(3);
    await fixture.whenStable();
    expect(findEl(fixture, 'btn-first').nativeElement.disabled).toBe(false);
    expect(findEl(fixture, 'btn-prev').nativeElement.disabled).toBe(false);
  });

  it('emits page 2 when next button is clicked from page 1', async () => {
    click(fixture, 'btn-next');
    await fixture.whenStable();
    expect(host.emittedPage).toBe(2);
  });

  it('emits page 1 when first button is clicked from page 3', async () => {
    host.page.set(3);
    await fixture.whenStable();
    click(fixture, 'btn-first');
    await fixture.whenStable();
    expect(host.emittedPage).toBe(1);
  });

  it('emits previous page when prev button is clicked', async () => {
    host.page.set(4);
    await fixture.whenStable();
    click(fixture, 'btn-prev');
    await fixture.whenStable();
    expect(host.emittedPage).toBe(3);
  });

  it('emits last page index when last button is clicked', async () => {
    click(fixture, 'btn-last');
    await fixture.whenStable();
    expect(host.emittedPage).toBe(10);
  });

  it('has role="navigation" on the host element', () => {
    const nav = queryByCss(fixture, 'app-paginator');
    expect(nav.nativeElement.getAttribute('role')).toBe('navigation');
  });
});
