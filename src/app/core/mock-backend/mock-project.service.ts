import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

export interface ProjectShell {
  id: string;
  name: string;
  phase: string;
  role: string;
  scope: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  priority: 'P0' | 'P1' | 'P2';
}

export interface ShellMetric {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'blocked';
}

const demoProjectId = '42';

@Injectable({ providedIn: 'root' })
export class MockProjectService {
  getProjectShell() {
    return of<ProjectShell>({
      id: demoProjectId,
      name: 'Deux familles, un terrain',
      phase: 'Faisabilité et structure juridique',
      role: 'Représentant famille A',
      scope: 'Vue projet partagée',
    }).pipe(delay(120));
  }

  getNavigation() {
    return of<NavigationItem[]>([
      { label: 'Tableau de bord', path: `/projects/${demoProjectId}/dashboard`, priority: 'P0' },
      { label: 'Initialisation', path: '/projects/new', priority: 'P0' },
      { label: 'Documents', path: `/projects/${demoProjectId}/documents`, priority: 'P0' },
      {
        label: 'Budget et financement',
        path: `/projects/${demoProjectId}/budget-financing`,
        priority: 'P0',
      },
      {
        label: 'Structure juridique',
        path: `/projects/${demoProjectId}/legal-structure`,
        priority: 'P0',
      },
      {
        label: 'Urbanisme et permis',
        path: `/projects/${demoProjectId}/urbanism-permits`,
        priority: 'P0',
      },
      {
        label: 'Décisions et réunions',
        path: `/projects/${demoProjectId}/decisions-meetings`,
        priority: 'P0',
      },
      {
        label: 'Infrastructures partagées',
        path: `/projects/${demoProjectId}/shared-assets`,
        priority: 'P0',
      },
      { label: 'Risques', path: `/projects/${demoProjectId}/risks`, priority: 'P0' },
      {
        label: 'Contrats et professionnels',
        path: `/projects/${demoProjectId}/contracts-professionals`,
        priority: 'P1',
      },
      { label: 'Terrain', path: `/projects/${demoProjectId}/land`, priority: 'P1' },
      { label: 'Planning', path: `/projects/${demoProjectId}/schedule`, priority: 'P1' },
      {
        label: 'Chantier et qualité',
        path: `/projects/${demoProjectId}/site-quality`,
        priority: 'P1',
      },
      {
        label: 'Rapports et exports',
        path: `/projects/${demoProjectId}/reports-exports`,
        priority: 'P1',
      },
      {
        label: 'Achats et matériaux',
        path: `/projects/${demoProjectId}/procurement-materials`,
        priority: 'P2',
      },
      {
        label: 'Conception et technique',
        path: `/projects/${demoProjectId}/design-technical`,
        priority: 'P2',
      },
      { label: 'Paramètres', path: `/projects/${demoProjectId}/settings`, priority: 'P0' },
    ]).pipe(delay(120));
  }

  getShellMetrics() {
    return of<ShellMetric[]>([
      { label: 'Documents manquants', value: '14', status: 'warning' },
      { label: 'Blocages partagés', value: '3', status: 'blocked' },
      { label: 'Validations en attente', value: '5', status: 'warning' },
    ]).pipe(delay(120));
  }
}
