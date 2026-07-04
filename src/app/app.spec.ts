import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { App } from './app';
import { routes } from './app.routes';
import { ProjectApiService } from './core/api/project-api.service';

const projectApiStub = {
  getProjectShell: () =>
    of({
      id: '42',
      name: 'Two families, one land',
      phase: 'Feasibility and legal structure',
      role: 'Family A representative',
      scope: 'Shared project view',
    }),
  getNavigation: () => of([]),
  getShellMetrics: () => of([]),
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: ProjectApiService, useValue: projectApiStub }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application brand', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('Estates for Real');
  });
});
