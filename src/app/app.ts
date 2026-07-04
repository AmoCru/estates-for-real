import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ProjectApiService } from './core/api/project-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly projectApi = inject(ProjectApiService);

  protected readonly project = toSignal(this.projectApi.getProjectShell(), { initialValue: null });
  protected readonly navigation = toSignal(this.projectApi.getNavigation(), { initialValue: [] });
  protected readonly metrics = toSignal(this.projectApi.getShellMetrics(), { initialValue: [] });
}
