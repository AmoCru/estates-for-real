import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  BudgetFinancingStore,
  BudgetScope,
  FinancingOwner,
  FinancingStatus,
  FinancingType,
  PaymentSource,
} from './budget-financing.store';

interface BudgetDraft {
  category: string;
  label: string;
  scope: BudgetScope;
  amount: number;
  paidBy: PaymentSource;
  familyAShare: number;
  familyBShare: number;
}

interface FinancingDraft {
  label: string;
  owner: FinancingOwner;
  type: FinancingType;
  status: FinancingStatus;
  amount: number;
}

interface BudgetSummary {
  plannedTotal: number;
  paidTotal: number;
  sharedTotal: number;
  familyAAllocation: number;
  familyBAllocation: number;
  securedFunding: number;
  pendingFunding: number;
  fundingGap: number;
  contingencyTarget: number;
}

const defaultBudgetDraft = (): BudgetDraft => ({
  category: 'Infrastructure partagée',
  label: '',
  scope: 'shared',
  amount: 0,
  paidBy: 'not-paid',
  familyAShare: 50,
  familyBShare: 50,
});

const defaultFinancingDraft = (): FinancingDraft => ({
  label: '',
  owner: 'shared',
  type: 'loan',
  status: 'pending',
  amount: 0,
});

@Component({
  selector: 'app-budget-financing-page',
  imports: [CommonModule, FormsModule],
  template: `
    <section class="budget-page">
      <header class="hero">
        <div>
          <p class="eyebrow">Budget et financement</p>
          <h1>Piloter les coûts privés et partagés de construction</h1>
          <p>
            Suivez les coûts prévus, qui les paie, comment ils sont répartis entre les deux familles
            et quels financements sont sécurisés.
          </p>
        </div>
        <aside class="storage-card">
          <span>{{ persistenceLabel }}</span>
          <strong>Dernier enregistrement le {{ store.updatedAt() | date: 'short' }}</strong>
          <button type="button" (click)="resetDemoData()">
            Réinitialiser les données de démonstration
          </button>
        </aside>
      </header>

      <section class="summary-grid" aria-label="Résumé du budget">
        <article>
          <span>Budget prévisionnel</span>
          <strong>{{ summary().plannedTotal | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
        <article>
          <span>Payé ou avancé</span>
          <strong>{{ summary().paidTotal | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
        <article>
          <span>Coûts partagés</span>
          <strong>{{ summary().sharedTotal | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
        <article>
          <span>Financement sécurisé</span>
          <strong>{{ summary().securedFunding | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
        <article class="warning-card" [class.blocked]="summary().fundingGap > 0">
          <span>Écart par rapport aux fonds sécurisés</span>
          <strong>{{ summary().fundingGap | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
        <article>
          <span>Provision cible de 10 %</span>
          <strong>{{ summary().contingencyTarget | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
        </article>
      </section>

      <section class="split-grid">
        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Répartition</p>
              <h2>Exposition des familles</h2>
            </div>
          </div>
          <div class="allocation-bars">
            <div>
              <span>Part de la famille A</span>
              <strong>{{
                summary().familyAAllocation | currency: 'EUR' : 'symbol' : '1.0-0'
              }}</strong>
            </div>
            <div>
              <span>Part de la famille B</span>
              <strong>{{
                summary().familyBAllocation | currency: 'EUR' : 'symbol' : '1.0-0'
              }}</strong>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Couverture</p>
              <h2>État du financement</h2>
            </div>
          </div>
          <div class="allocation-bars">
            <div>
              <span>Financement en attente</span>
              <strong>{{ summary().pendingFunding | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
            </div>
            <div>
              <span>Total des financements identifiés</span>
              <strong>{{ identifiedFunding() | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
            </div>
          </div>
        </article>
      </section>

      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Coûts</p>
            <h2>Ajouter une ligne budgétaire</h2>
          </div>
        </div>

        <form class="entry-form" (ngSubmit)="addBudgetLine()">
          <label>
            Libellé
            <input
              name="budgetLabel"
              required
              [ngModel]="budgetDraft().label"
              (ngModelChange)="updateBudgetDraft('label', $event)"
              placeholder="Exemple : raccordement d'eau partagé"
            />
          </label>
          <label>
            Catégorie
            <select
              name="budgetCategory"
              [ngModel]="budgetDraft().category"
              (ngModelChange)="updateBudgetDraft('category', $event)"
            >
              @for (category of budgetCategories; track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </label>
          <label>
            Montant
            <input
              name="budgetAmount"
              type="number"
              min="0"
              step="100"
              [ngModel]="budgetDraft().amount"
              (ngModelChange)="updateBudgetAmount($event)"
            />
          </label>
          <label>
            Périmètre
            <select
              name="budgetScope"
              [ngModel]="budgetDraft().scope"
              (ngModelChange)="updateBudgetScope($event)"
            >
              <option value="shared">Partagé</option>
              <option value="family-a">Privé famille A</option>
              <option value="family-b">Privé famille B</option>
            </select>
          </label>
          <label>
            Payé par
            <select
              name="paidBy"
              [ngModel]="budgetDraft().paidBy"
              (ngModelChange)="updateBudgetDraft('paidBy', $event)"
            >
              <option value="not-paid">Pas encore payé</option>
              <option value="family-a">Famille A</option>
              <option value="family-b">Famille B</option>
              <option value="shared-account">Compte commun</option>
            </select>
          </label>

          @if (budgetDraft().scope === 'shared') {
            <label>
              Part famille A %
              <input
                name="familyAShare"
                type="number"
                min="0"
                max="100"
                [ngModel]="budgetDraft().familyAShare"
                (ngModelChange)="updateFamilyAShare($event)"
              />
            </label>
            <label>
              Part famille B %
              <input
                name="familyBShare"
                type="number"
                min="0"
                max="100"
                [ngModel]="budgetDraft().familyBShare"
                readonly
              />
            </label>
          }

          <button type="submit" [disabled]="!canAddBudgetLine()">
            Ajouter la ligne budgétaire
          </button>
        </form>

        @if (allocationWarning()) {
          <p class="form-warning">La répartition entre familles doit totaliser 100 %.</p>
        }

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ligne</th>
                <th>Périmètre</th>
                <th>Montant</th>
                <th>Famille A</th>
                <th>Famille B</th>
                <th>Payé par</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (line of store.budgetLines(); track line.id) {
                <tr>
                  <td>
                    <strong>{{ line.label }}</strong>
                    <span>{{ line.category }}</span>
                  </td>
                  <td>{{ scopeLabels[line.scope] }}</td>
                  <td>{{ line.amount | currency: 'EUR' : 'symbol' : '1.0-0' }}</td>
                  <td>
                    {{
                      (line.amount * line.familyAShare) / 100 | currency: 'EUR' : 'symbol' : '1.0-0'
                    }}
                  </td>
                  <td>
                    {{
                      (line.amount * line.familyBShare) / 100 | currency: 'EUR' : 'symbol' : '1.0-0'
                    }}
                  </td>
                  <td>{{ paymentLabels[line.paidBy] }}</td>
                  <td>
                    <button class="text-button" type="button" (click)="removeBudgetLine(line.id)">
                      Supprimer
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7">Aucune ligne budgétaire pour le moment.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Financement</p>
            <h2>Ajouter une source de financement</h2>
          </div>
        </div>

        <form class="entry-form" (ngSubmit)="addFinancingSource()">
          <label>
            Libellé
            <input
              name="financingLabel"
              required
              [ngModel]="financingDraft().label"
              (ngModelChange)="updateFinancingDraft('label', $event)"
              placeholder="Exemple : prêt bancaire famille A"
            />
          </label>
          <label>
            Porteur
            <select
              name="financingOwner"
              [ngModel]="financingDraft().owner"
              (ngModelChange)="updateFinancingDraft('owner', $event)"
            >
              <option value="family-a">Famille A</option>
              <option value="family-b">Famille B</option>
              <option value="shared">Partagé</option>
            </select>
          </label>
          <label>
            Type
            <select
              name="financingType"
              [ngModel]="financingDraft().type"
              (ngModelChange)="updateFinancingDraft('type', $event)"
            >
              <option value="loan">Prêt</option>
              <option value="personal-contribution">Apport personnel</option>
              <option value="gift">Don</option>
              <option value="grant">Subvention</option>
              <option value="other">Autre</option>
            </select>
          </label>
          <label>
            Statut
            <select
              name="financingStatus"
              [ngModel]="financingDraft().status"
              (ngModelChange)="updateFinancingDraft('status', $event)"
            >
              <option value="secured">Sécurisé</option>
              <option value="pending">En attente</option>
            </select>
          </label>
          <label>
            Montant
            <input
              name="financingAmount"
              type="number"
              min="0"
              step="1000"
              [ngModel]="financingDraft().amount"
              (ngModelChange)="updateFinancingAmount($event)"
            />
          </label>
          <button type="submit" [disabled]="!canAddFinancingSource()">
            Ajouter le financement
          </button>
        </form>

        <div class="finance-list">
          @for (source of store.financingSources(); track source.id) {
            <article>
              <div>
                <strong>{{ source.label }}</strong>
                <span
                  >{{ ownerLabels[source.owner] }} - {{ financingTypeLabels[source.type] }}</span
                >
              </div>
              <span class="status" [class.pending]="source.status === 'pending'">{{
                financingStatusLabels[source.status]
              }}</span>
              <strong>{{ source.amount | currency: 'EUR' : 'symbol' : '1.0-0' }}</strong>
              <button class="text-button" type="button" (click)="removeFinancingSource(source.id)">
                Supprimer
              </button>
            </article>
          } @empty {
            <p class="empty-state">Aucune source de financement pour le moment.</p>
          }
        </div>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .budget-page {
      display: grid;
      gap: 1.25rem;
    }

    .hero,
    .panel,
    .summary-grid article,
    .storage-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    .hero {
      display: grid;
      gap: 1rem;
      grid-template-columns: minmax(0, 1fr) 18rem;
      padding: clamp(1.5rem, 4vw, 2.5rem);
    }

    .eyebrow {
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      margin: 0 0 0.5rem;
      text-transform: uppercase;
    }

    h1,
    h2,
    p {
      margin: 0;
    }

    h1 {
      color: var(--ink);
      font-size: clamp(2rem, 4vw, 3.2rem);
      letter-spacing: 0;
      line-height: 1;
      margin-bottom: 0.9rem;
      max-width: 12ch;
    }

    h2 {
      color: var(--ink);
      font-size: 1.25rem;
      letter-spacing: 0;
    }

    .hero p,
    .panel span,
    .storage-card span,
    .empty-state {
      color: var(--muted);
    }

    .storage-card {
      align-content: start;
      display: grid;
      gap: 0.75rem;
      padding: 1rem;
    }

    button {
      background: #172033;
      border: 0;
      border-radius: 8px;
      color: #ffffff;
      cursor: pointer;
      font-weight: 800;
      padding: 0.7rem 0.95rem;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    .text-button {
      background: transparent;
      color: #7c2d12;
      padding: 0;
    }

    .summary-grid,
    .split-grid {
      display: grid;
      gap: 1rem;
    }

    .summary-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .summary-grid article {
      display: grid;
      gap: 0.45rem;
      padding: 1rem;
    }

    .summary-grid strong,
    .allocation-bars strong {
      color: var(--ink);
      font-size: 1.35rem;
    }

    .warning-card {
      border-left: 4px solid #f59e0b !important;
    }

    .warning-card.blocked {
      border-left-color: #dc2626 !important;
    }

    .split-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .panel {
      display: grid;
      gap: 1rem;
      padding: clamp(1rem, 3vw, 1.5rem);
    }

    .panel-heading {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .allocation-bars {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .allocation-bars div {
      background: #f8f5ee;
      border: 1px solid var(--border);
      border-radius: 8px;
      display: grid;
      gap: 0.4rem;
      padding: 1rem;
    }

    .entry-form {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    label {
      color: var(--ink);
      display: grid;
      font-size: 0.85rem;
      font-weight: 800;
      gap: 0.35rem;
    }

    input,
    select {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--ink);
      min-height: 2.7rem;
      padding: 0.65rem 0.75rem;
    }

    .entry-form button {
      align-self: end;
    }

    .form-warning {
      color: #b45309;
      font-weight: 800;
    }

    .table-wrap {
      overflow-x: auto;
    }

    table {
      border-collapse: collapse;
      min-width: 54rem;
      width: 100%;
    }

    th,
    td {
      border-bottom: 1px solid var(--border);
      padding: 0.85rem;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: var(--muted);
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    td strong,
    td span {
      display: block;
    }

    .finance-list {
      display: grid;
      gap: 0.75rem;
    }

    .finance-list article {
      align-items: center;
      background: #f8f5ee;
      border: 1px solid var(--border);
      border-radius: 8px;
      display: grid;
      gap: 1rem;
      grid-template-columns: minmax(0, 1fr) auto auto auto;
      padding: 1rem;
    }

    .status {
      background: #dcfce7;
      border-radius: 999px;
      color: #166534;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.35rem 0.65rem;
      text-transform: uppercase;
    }

    .status.pending {
      background: #fef3c7;
      color: #92400e;
    }

    @media (max-width: 1100px) {
      .hero,
      .summary-grid,
      .split-grid,
      .allocation-bars,
      .entry-form {
        grid-template-columns: 1fr;
      }

      .finance-list article {
        align-items: start;
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class BudgetFinancingPage {
  protected readonly store = inject(BudgetFinancingStore);

  protected readonly budgetCategories = [
    'Acquisition du terrain',
    'Juridique et administration',
    'Études techniques',
    'Infrastructure partagée',
    'Travaux privés maison A',
    'Travaux privés maison B',
    'Taxes et charges publiques',
    'Assurances et garanties',
    'Provision pour imprévus',
  ];

  protected readonly scopeLabels: Record<BudgetScope, string> = {
    'family-a': 'Privé famille A',
    'family-b': 'Privé famille B',
    shared: 'Partagé',
  };

  protected readonly paymentLabels: Record<PaymentSource, string> = {
    'family-a': 'Famille A',
    'family-b': 'Famille B',
    'shared-account': 'Compte commun',
    'not-paid': 'Pas encore payé',
  };

  protected readonly ownerLabels: Record<FinancingOwner, string> = {
    'family-a': 'Famille A',
    'family-b': 'Famille B',
    shared: 'Partagé',
  };

  protected readonly financingTypeLabels: Record<FinancingType, string> = {
    gift: 'Don',
    grant: 'Subvention',
    loan: 'Prêt',
    other: 'Autre',
    'personal-contribution': 'Apport personnel',
  };

  protected readonly financingStatusLabels: Record<FinancingStatus, string> = {
    pending: 'En attente',
    secured: 'Sécurisé',
  };

  protected readonly budgetDraft = signal<BudgetDraft>(defaultBudgetDraft());
  protected readonly financingDraft = signal<FinancingDraft>(defaultFinancingDraft());

  protected readonly persistenceLabel = this.store.localStorageAvailable
    ? 'Stockage local activé'
    : 'Brouillon en mémoire uniquement';

  protected readonly summary = computed<BudgetSummary>(() => {
    const budgetLines = this.store.budgetLines();
    const financingSources = this.store.financingSources();
    const plannedTotal = this.sum(budgetLines.map((line) => line.amount));
    const paidTotal = this.sum(
      budgetLines.filter((line) => line.paidBy !== 'not-paid').map((line) => line.amount),
    );
    const sharedTotal = this.sum(
      budgetLines.filter((line) => line.scope === 'shared').map((line) => line.amount),
    );
    const familyAAllocation = this.sum(
      budgetLines.map((line) => (line.amount * line.familyAShare) / 100),
    );
    const familyBAllocation = this.sum(
      budgetLines.map((line) => (line.amount * line.familyBShare) / 100),
    );
    const securedFunding = this.sum(
      financingSources
        .filter((source) => source.status === 'secured')
        .map((source) => source.amount),
    );
    const pendingFunding = this.sum(
      financingSources
        .filter((source) => source.status === 'pending')
        .map((source) => source.amount),
    );

    return {
      plannedTotal,
      paidTotal,
      sharedTotal,
      familyAAllocation,
      familyBAllocation,
      securedFunding,
      pendingFunding,
      fundingGap: Math.max(plannedTotal - securedFunding, 0),
      contingencyTarget: plannedTotal * 0.1,
    };
  });

  protected readonly identifiedFunding = computed(
    () => this.summary().securedFunding + this.summary().pendingFunding,
  );
  protected readonly allocationWarning = computed(
    () => this.budgetDraft().familyAShare + this.budgetDraft().familyBShare !== 100,
  );

  protected updateBudgetDraft<Key extends keyof BudgetDraft>(
    key: Key,
    value: BudgetDraft[Key],
  ): void {
    this.budgetDraft.update((draft) => ({ ...draft, [key]: value }));
  }

  protected updateBudgetAmount(value: number | string): void {
    this.updateBudgetDraft('amount', this.toPositiveNumber(value));
  }

  protected updateBudgetScope(scope: BudgetScope): void {
    const allocation = this.defaultAllocationForScope(scope);
    this.budgetDraft.update((draft) => ({ ...draft, scope, ...allocation }));
  }

  protected updateFamilyAShare(value: number | string): void {
    const familyAShare = Math.min(100, this.toPositiveNumber(value));
    this.budgetDraft.update((draft) => ({
      ...draft,
      familyAShare,
      familyBShare: 100 - familyAShare,
    }));
  }

  protected canAddBudgetLine(): boolean {
    const draft = this.budgetDraft();
    return (
      draft.label.trim().length > 0 &&
      draft.amount > 0 &&
      draft.familyAShare + draft.familyBShare === 100
    );
  }

  protected addBudgetLine(): void {
    if (!this.canAddBudgetLine()) {
      return;
    }

    const draft = this.budgetDraft();
    this.store.addBudgetLine({
      ...draft,
      label: draft.label.trim(),
    });
    this.budgetDraft.set(defaultBudgetDraft());
  }

  protected removeBudgetLine(lineId: string): void {
    this.store.removeBudgetLine(lineId);
  }

  protected updateFinancingDraft<Key extends keyof FinancingDraft>(
    key: Key,
    value: FinancingDraft[Key],
  ): void {
    this.financingDraft.update((draft) => ({ ...draft, [key]: value }));
  }

  protected updateFinancingAmount(value: number | string): void {
    this.updateFinancingDraft('amount', this.toPositiveNumber(value));
  }

  protected canAddFinancingSource(): boolean {
    const draft = this.financingDraft();
    return draft.label.trim().length > 0 && draft.amount > 0;
  }

  protected addFinancingSource(): void {
    if (!this.canAddFinancingSource()) {
      return;
    }

    const draft = this.financingDraft();
    this.store.addFinancingSource({
      ...draft,
      label: draft.label.trim(),
    });
    this.financingDraft.set(defaultFinancingDraft());
  }

  protected removeFinancingSource(sourceId: string): void {
    this.store.removeFinancingSource(sourceId);
  }

  protected resetDemoData(): void {
    this.store.resetDemoData();
  }

  private defaultAllocationForScope(
    scope: BudgetScope,
  ): Pick<BudgetDraft, 'familyAShare' | 'familyBShare'> {
    if (scope === 'family-a') {
      return { familyAShare: 100, familyBShare: 0 };
    }

    if (scope === 'family-b') {
      return { familyAShare: 0, familyBShare: 100 };
    }

    return { familyAShare: 50, familyBShare: 50 };
  }

  private toPositiveNumber(value: number | string): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
  }

  private sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
  }
}
