import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, shareReplay } from 'rxjs';

import {
  MockProjectService,
  NavigationItem,
  ProjectShell,
  ShellMetric,
} from '../mock-backend/mock-project.service';

interface ProjectShellResponse {
  project: ProjectShell;
  navigation: NavigationItem[];
  metrics: ShellMetric[];
}

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);
  private readonly mockProject = inject(MockProjectService);
  private readonly projectId = '42';

  private readonly shellResponse$ = this.http
    .get<ProjectShellResponse>(`/api/projects/${this.projectId}/shell`)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getProjectShell() {
    return this.shellResponse$.pipe(
      map((response) => response.project),
      catchError(() => this.mockProject.getProjectShell()),
    );
  }

  getNavigation() {
    return this.shellResponse$.pipe(
      map((response) => response.navigation),
      catchError(() => this.mockProject.getNavigation()),
    );
  }

  getShellMetrics() {
    return this.shellResponse$.pipe(
      map((response) => response.metrics),
      catchError(() => this.mockProject.getShellMetrics()),
    );
  }
}
