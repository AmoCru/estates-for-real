import { computed, Injectable, signal } from '@angular/core';

export type BudgetScope = 'family-a' | 'family-b' | 'shared';
export type PaymentSource = 'family-a' | 'family-b' | 'shared-account' | 'not-paid';
export type FinancingOwner = 'family-a' | 'family-b' | 'shared';
export type FinancingStatus = 'secured' | 'pending';
export type FinancingType = 'loan' | 'personal-contribution' | 'gift' | 'grant' | 'other';

export interface BudgetLine {
  id: string;
  category: string;
  label: string;
  scope: BudgetScope;
  amount: number;
  paidBy: PaymentSource;
  familyAShare: number;
  familyBShare: number;
}

export interface FinancingSource {
  id: string;
  label: string;
  owner: FinancingOwner;
  type: FinancingType;
  status: FinancingStatus;
  amount: number;
}

export interface BudgetFinancingState {
  budgetLines: BudgetLine[];
  financingSources: FinancingSource[];
  updatedAt: string;
}

const storageKey = 'estates-for-real:budget-financing:v1';

const categoryTranslations: Record<string, string> = {
  Contingency: 'Provision pour imprévus',
  'House A private works': 'Travaux privés maison A',
  'House B private works': 'Travaux privés maison B',
  'Insurance and guarantees': 'Assurances et garanties',
  'Land acquisition': 'Acquisition du terrain',
  'Legal and administration': 'Juridique et administration',
  'Shared infrastructure': 'Infrastructure partagée',
  'Taxes and public charges': 'Taxes et charges publiques',
  'Technical studies': 'Études techniques',
};

const budgetLineTranslations: Record<string, string> = {
  'Estimated notarial fees and duties': 'Frais de notaire et droits estimés',
  'G2 soil study': 'Étude de sol G2',
  'House A window upgrade': 'Amélioration des fenêtres de la maison A',
  'Land purchase price': "Prix d'achat du terrain",
  'Shared driveway and access works': "Allée commune et travaux d'accès",
};

const financingSourceTranslations: Record<string, string> = {
  'Family A construction loan': 'Prêt construction famille A',
  'Family B construction loan': 'Prêt construction famille B',
  'Shared personal contribution': 'Apport personnel commun',
};

const initialState = (): BudgetFinancingState => ({
  updatedAt: new Date().toISOString(),
  budgetLines: [
    {
      id: 'land-purchase',
      category: 'Acquisition du terrain',
      label: "Prix d'achat du terrain",
      scope: 'shared',
      amount: 220000,
      paidBy: 'not-paid',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'notaire-fees',
      category: 'Juridique et administration',
      label: 'Frais de notaire et droits estimés',
      scope: 'shared',
      amount: 18000,
      paidBy: 'not-paid',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'shared-driveway',
      category: 'Infrastructure partagée',
      label: "Allée commune et travaux d'accès",
      scope: 'shared',
      amount: 20000,
      paidBy: 'family-a',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'house-a-upgrade',
      category: 'Travaux privés maison A',
      label: 'Amélioration des fenêtres de la maison A',
      scope: 'family-a',
      amount: 8500,
      paidBy: 'family-a',
      familyAShare: 100,
      familyBShare: 0,
    },
    {
      id: 'soil-study',
      category: 'Études techniques',
      label: 'Étude de sol G2',
      scope: 'shared',
      amount: 2800,
      paidBy: 'family-b',
      familyAShare: 50,
      familyBShare: 50,
    },
  ],
  financingSources: [
    {
      id: 'family-a-loan',
      label: 'Prêt construction famille A',
      owner: 'family-a',
      type: 'loan',
      status: 'pending',
      amount: 310000,
    },
    {
      id: 'family-b-loan',
      label: 'Prêt construction famille B',
      owner: 'family-b',
      type: 'loan',
      status: 'pending',
      amount: 300000,
    },
    {
      id: 'shared-savings',
      label: 'Apport personnel commun',
      owner: 'shared',
      type: 'personal-contribution',
      status: 'secured',
      amount: 80000,
    },
  ],
});

@Injectable({ providedIn: 'root' })
export class BudgetFinancingStore {
  readonly localStorageAvailable = this.canUseLocalStorage();

  private readonly stateSignal = signal<BudgetFinancingState>(this.readState());

  readonly state = this.stateSignal.asReadonly();
  readonly budgetLines = computed(() => this.stateSignal().budgetLines);
  readonly financingSources = computed(() => this.stateSignal().financingSources);
  readonly updatedAt = computed(() => this.stateSignal().updatedAt);

  addBudgetLine(line: Omit<BudgetLine, 'id'>): void {
    this.updateState((state) => ({
      ...state,
      budgetLines: [...state.budgetLines, { ...line, id: this.createId('budget') }],
    }));
  }

  removeBudgetLine(lineId: string): void {
    this.updateState((state) => ({
      ...state,
      budgetLines: state.budgetLines.filter((line) => line.id !== lineId),
    }));
  }

  addFinancingSource(source: Omit<FinancingSource, 'id'>): void {
    this.updateState((state) => ({
      ...state,
      financingSources: [...state.financingSources, { ...source, id: this.createId('financing') }],
    }));
  }

  removeFinancingSource(sourceId: string): void {
    this.updateState((state) => ({
      ...state,
      financingSources: state.financingSources.filter((source) => source.id !== sourceId),
    }));
  }

  resetDemoData(): void {
    this.setState(initialState());
  }

  private updateState(updater: (state: BudgetFinancingState) => BudgetFinancingState): void {
    this.setState(updater(this.stateSignal()));
  }

  private setState(state: BudgetFinancingState): void {
    const nextState = { ...state, updatedAt: new Date().toISOString() };
    this.stateSignal.set(nextState);
    this.writeState(nextState);
  }

  private readState(): BudgetFinancingState {
    if (!this.localStorageAvailable) {
      return initialState();
    }

    const storedState = localStorage.getItem(storageKey);
    if (!storedState) {
      const defaultState = initialState();
      this.writeState(defaultState);
      return defaultState;
    }

    try {
      return this.normalizeState(JSON.parse(storedState) as Partial<BudgetFinancingState>);
    } catch {
      const defaultState = initialState();
      this.writeState(defaultState);
      return defaultState;
    }
  }

  private normalizeState(state: Partial<BudgetFinancingState>): BudgetFinancingState {
    return {
      budgetLines: Array.isArray(state.budgetLines)
        ? state.budgetLines.map((line) => ({
            ...line,
            category: this.translateStoredValue(line.category, categoryTranslations),
            label: this.translateStoredValue(line.label, budgetLineTranslations),
          }))
        : [],
      financingSources: Array.isArray(state.financingSources)
        ? state.financingSources.map((source) => ({
            ...source,
            label: this.translateStoredValue(source.label, financingSourceTranslations),
          }))
        : [],
      updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : new Date().toISOString(),
    };
  }

  private translateStoredValue(value: string, translations: Record<string, string>): string {
    return translations[value] ?? value;
  }

  private writeState(state: BudgetFinancingState): void {
    if (this.localStorageAvailable) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }

  private canUseLocalStorage(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  private createId(prefix: string): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }
}
