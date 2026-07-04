import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MockProjectService } from './core/mock-backend/mock-project.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly mockProject = inject(MockProjectService);

  protected readonly project = toSignal(this.mockProject.getProjectShell(), { initialValue: null });
  protected readonly navigation = toSignal(this.mockProject.getNavigation(), { initialValue: [] });
  protected readonly metrics = toSignal(this.mockProject.getShellMetrics(), { initialValue: [] });
}
