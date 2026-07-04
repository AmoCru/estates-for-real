import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

interface PageData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-placeholder-page',
  template: `
    <section class="page-card">
      <p class="eyebrow">Produit minimum opérationnel</p>
      <h1>{{ page().title }}</h1>
      <p>{{ page().description }}</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .page-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: clamp(1.5rem, 4vw, 3rem);
    }

    .eyebrow {
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0 0 0.75rem;
      text-transform: uppercase;
    }

    h1 {
      color: var(--ink);
      font-size: clamp(2rem, 4vw, 3.5rem);
      letter-spacing: 0;
      line-height: 1;
      margin: 0 0 1rem;
    }

    p {
      color: var(--muted);
      font-size: 1rem;
      line-height: 1.6;
      margin: 0;
      max-width: 68ch;
    }
  `,
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(
    this.route.data.pipe(
      map((data) => ({
        title: String(data['title'] ?? 'Page'),
        description: String(
          data['description'] ?? 'Cette page est prête pour sa première verticale fonctionnelle.',
        ),
      })),
    ),
    {
      initialValue: {
        title: 'Page',
        description: 'Cette page est prête pour sa première verticale fonctionnelle.',
      },
    },
  );

  protected readonly page = computed<PageData>(() => this.routeData());
}
