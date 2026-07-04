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

const demoProjectId = 'demo-project';

@Injectable({ providedIn: 'root' })
export class MockProjectService {
  getProjectShell() {
    return of<ProjectShell>({
      id: demoProjectId,
      name: 'Two families, one land',
      phase: 'Feasibility and legal structure',
      role: 'Family A representative',
      scope: 'Shared project view',
    }).pipe(delay(120));
  }

  getNavigation() {
    return of<NavigationItem[]>([
      { label: 'Dashboard', path: `/projects/${demoProjectId}/dashboard`, priority: 'P0' },
      { label: 'Onboarding', path: '/projects/new', priority: 'P0' },
      { label: 'Documents', path: `/projects/${demoProjectId}/documents`, priority: 'P0' },
      { label: 'Budget and financing', path: `/projects/${demoProjectId}/budget-financing`, priority: 'P0' },
      { label: 'Legal structure', path: `/projects/${demoProjectId}/legal-structure`, priority: 'P0' },
      { label: 'Urbanism and permits', path: `/projects/${demoProjectId}/urbanism-permits`, priority: 'P0' },
      { label: 'Decisions and meetings', path: `/projects/${demoProjectId}/decisions-meetings`, priority: 'P0' },
      { label: 'Shared assets', path: `/projects/${demoProjectId}/shared-assets`, priority: 'P0' },
      { label: 'Risks', path: `/projects/${demoProjectId}/risks`, priority: 'P0' },
      { label: 'Contracts and professionals', path: `/projects/${demoProjectId}/contracts-professionals`, priority: 'P1' },
      { label: 'Land', path: `/projects/${demoProjectId}/land`, priority: 'P1' },
      { label: 'Schedule', path: `/projects/${demoProjectId}/schedule`, priority: 'P1' },
      { label: 'Site and quality', path: `/projects/${demoProjectId}/site-quality`, priority: 'P1' },
      { label: 'Reports and exports', path: `/projects/${demoProjectId}/reports-exports`, priority: 'P1' },
      { label: 'Procurement and materials', path: `/projects/${demoProjectId}/procurement-materials`, priority: 'P2' },
      { label: 'Design and technical', path: `/projects/${demoProjectId}/design-technical`, priority: 'P2' },
      { label: 'Settings', path: `/projects/${demoProjectId}/settings`, priority: 'P0' },
    ]).pipe(delay(120));
  }

  getShellMetrics() {
    return of<ShellMetric[]>([
      { label: 'Missing documents', value: '14', status: 'warning' },
      { label: 'Shared blockers', value: '3', status: 'blocked' },
      { label: 'Pending approvals', value: '5', status: 'warning' },
    ]).pipe(delay(120));
  }
}