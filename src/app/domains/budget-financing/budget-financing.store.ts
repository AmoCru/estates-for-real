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

const initialState = (): BudgetFinancingState => ({
  updatedAt: new Date().toISOString(),
  budgetLines: [
    {
      id: 'land-purchase',
      category: 'Land acquisition',
      label: 'Land purchase price',
      scope: 'shared',
      amount: 220000,
      paidBy: 'not-paid',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'notaire-fees',
      category: 'Legal and administration',
      label: 'Estimated notarial fees and duties',
      scope: 'shared',
      amount: 18000,
      paidBy: 'not-paid',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'shared-driveway',
      category: 'Shared infrastructure',
      label: 'Shared driveway and access works',
      scope: 'shared',
      amount: 20000,
      paidBy: 'family-a',
      familyAShare: 50,
      familyBShare: 50,
    },
    {
      id: 'house-a-upgrade',
      category: 'House A private works',
      label: 'House A window upgrade',
      scope: 'family-a',
      amount: 8500,
      paidBy: 'family-a',
      familyAShare: 100,
      familyBShare: 0,
    },
    {
      id: 'soil-study',
      category: 'Technical studies',
      label: 'G2 soil study',
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
      label: 'Family A construction loan',
      owner: 'family-a',
      type: 'loan',
      status: 'pending',
      amount: 310000,
    },
    {
      id: 'family-b-loan',
      label: 'Family B construction loan',
      owner: 'family-b',
      type: 'loan',
      status: 'pending',
      amount: 300000,
    },
    {
      id: 'shared-savings',
      label: 'Shared personal contribution',
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
      budgetLines: Array.isArray(state.budgetLines) ? state.budgetLines : [],
      financingSources: Array.isArray(state.financingSources) ? state.financingSources : [],
      updatedAt: typeof state.updatedAt === 'string' ? state.updatedAt : new Date().toISOString(),
    };
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
