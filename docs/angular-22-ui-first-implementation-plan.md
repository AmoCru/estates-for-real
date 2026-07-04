# Angular 22 UI-First Implementation Plan

Status: Draft implementation plan
Target frontend: Angular 22 web application
Backend strategy during UI build: mocked BFF calls through the real frontend data-access layer
Related architecture: [angular-22-high-level-architecture.md](angular-22-high-level-architecture.md)
Related product specification: [house-construction-france-software-spec.md](house-construction-france-software-spec.md)

## 1. Implementation Strategy

Build the application from the UI inward. The first usable product should be a navigable Angular application with realistic project data, realistic permissions, realistic latency, and realistic errors, even before the production backend exists.

The UI must never call hard-coded component data directly. Every screen must call a domain facade, every facade must call the same API client that will later call the real backend, and mock responses must be provided by a development-only mock API layer.

Primary strategy:

1. Create the Angular shell and visual system first.
2. Define DTO contracts for the first MVP screens.
3. Mock backend calls at the HTTP boundary.
4. Build each domain as a vertical UI slice: route, facade, mocked endpoint, screen, forms, loading states, empty states, error states, and tests.
5. Replace mocked handlers with real backend endpoints progressively, without changing feature components.

## 2. Guiding Rules

1. Mock at the API boundary, not inside components.
2. Build user-visible workflows before backend internals.
3. Keep DTOs and view models separate from the beginning.
4. Treat permissions, project scope, approvals, deadlines, and validation statuses as first-class UI concerns.
5. Every P0 route must have realistic loading, empty, error, and permission-denied states.
6. Every mutation must use a command-style API shape, even when mocked.
7. Mock data must include imperfect cases: missing documents, blocked validations, overdue deadlines, rejected approvals, financing gaps, and shared-cost disputes.
8. The app must be demoable after each milestone.

## 3. Mock Backend Approach

Use Mock Service Worker or an equivalent HTTP-boundary mock layer for local development and UI tests. The preferred approach is MSW because it intercepts real HTTP calls and keeps the Angular app using the same `HttpClient` code path that the production backend will use.

Mock mode must be selected through configuration:

```text
apiMode = mock | real
apiBaseUrl = /api
mockLatency = none | realistic | slow
mockScenario = happy-path | incomplete-project | permission-limited | dispute | offline-risk
```

Suggested mock structure:

```text
src/
  mocks/
    browser.ts
    handlers.ts
    scenarios/
      happy-path.ts
      incomplete-project.ts
      permission-limited.ts
      dispute.ts
      offline-risk.ts
    fixtures/
      users.fixture.ts
      projects.fixture.ts
      dashboard.fixture.ts
      documents.fixture.ts
      budget.fixture.ts
      legal-scenarios.fixture.ts
      permits.fixture.ts
      decisions.fixture.ts
      shared-assets.fixture.ts
      risks.fixture.ts
    state/
      mock-db.ts
      mock-command-log.ts
      mock-upload-store.ts
```

Mock handlers must support:

1. Query endpoints.
2. Command endpoints.
3. Upload progress simulation.
4. Export job status simulation.
5. Permission-denied responses.
6. Validation errors.
7. Version conflicts.
8. Network errors and degraded mode.
9. Latency variation.
10. Scenario switching without code changes.

## 4. Initial UI Scope

Start with the screens that prove the product value for two families building two houses on one land parcel:

1. Project shell and dashboard.
2. Project onboarding wizard.
3. Documents repository.
4. Budget and cost allocation.
5. Legal-structure scenario comparison.
6. Urbanism and permit deadlines.
7. Decisions and approvals.
8. Shared asset register.
9. Risk register.

Do not start with procurement, advanced integrations, OCR, offline sync, or full report generation. Represent them as mocked placeholders or job-status screens until the P0 user flows are stable.

## 5. Milestone Plan

### Milestone 0: Product UI Skeleton

Goal: create a navigable Angular 22 app that demonstrates the product shape without real domain logic.

Deliverables:

1. Angular 22 project with strict TypeScript.
2. Standalone app configuration.
3. Lazy route skeletons for all product areas.
4. Application shell with sidebar, top bar, project switcher, scope selector, command bar, and notification entry point.
5. Placeholder pages for all architecture routes.
6. Global layout responsive for desktop and tablet.
7. Initial design tokens for colors, spacing, typography, statuses, and scope badges.
8. Basic empty states for all routes.

Mocked backend calls:

1. `GET /api/me`
2. `GET /api/projects`
3. `GET /api/projects/:projectId/shell`
4. `GET /api/projects/:projectId/navigation-summary`
5. `GET /api/projects/:projectId/permissions`

Acceptance criteria:

1. User can open the app and select a mocked project.
2. User can navigate every primary route without a page reload.
3. Shell shows current project, family scope, role, notification count, and offline/mock indicator.
4. Switching mock scenarios changes counters and warnings in the shell.

### Milestone 1: Mock API Foundation

Goal: make mocked backend calls reliable enough for UI development.

Deliverables:

1. Mock server initialized only in development/test mode.
2. Typed DTOs for user, project shell, permissions, command response, validation error, deadline, money, project scope, and audit metadata.
3. API client wrapper around Angular `HttpClient`.
4. Central error mapper.
5. Command service for audited mutations.
6. Mock database with deterministic seeded data.
7. Mock command log for development inspection.
8. Scenario switcher available to developers.

Acceptance criteria:

1. Components cannot import mock fixtures directly.
2. Feature facades use the same API client in mock mode and real mode.
3. Mock handlers can return success, validation error, permission error, version conflict, and network failure.
4. A developer can run the app in at least three scenarios: complete project, incomplete project, and permission-limited professional view.

### Milestone 2: Design System and Shared UI Components

Goal: build the reusable UI pieces needed by P0 workflows before screens multiply.

Deliverables:

1. Status badges: validation, approval, deadline, risk, document, project phase.
2. Scope badges: Family A, Family B, shared, professional-only, project-wide.
3. Money display and VAT-aware amount display.
4. Deadline display with source and uncertainty indicator.
5. Permission gate component.
6. Command confirmation dialog.
7. Entity timeline component.
8. Evidence/photo gallery shell.
9. Document picker shell.
10. Comparison matrix.
11. Allocation editor.
12. Risk matrix.
13. Loading, empty, error, permission-denied, and degraded-mode states.

Acceptance criteria:

1. Components are accessible by keyboard.
2. Status components do not rely on color alone.
3. Components render realistic long French legal labels without layout breakage.
4. Components are documented with sample states or lightweight demo pages.

### Milestone 3: Project Onboarding Wizard

Goal: let a user create the two-family/single-land project structure through UI only.

Deliverables:

1. Multi-step onboarding wizard.
2. Steps for land status, families, houses, ownership assumptions, shared assets, financing assumptions, professionals, and current phase.
3. Review step showing generated project structure.
4. Mock command to create project.
5. Redirect to dashboard after creation.

Mocked backend calls:

1. `GET /api/project-templates/two-family-single-land`
2. `POST /api/projects/commands/create-project`
3. `GET /api/projects/:projectId/onboarding-summary`

Acceptance criteria:

1. User can create a project with Family A, Family B, House A, House B, one parcel, and shared asset placeholders.
2. Wizard validates that every shared asset has an initial ownership/maintenance status, even if marked "to verify".
3. Wizard creates initial risks, document checklist, budget categories, deadlines, and governance defaults in mocked data.
4. User can leave and resume a draft onboarding session.

### Milestone 4: Dashboard First Usable Version

Goal: provide a real project control surface based on mocked summaries.

Deliverables:

1. Current phase panel.
2. Critical blockers panel.
3. Upcoming deadlines panel.
4. Budget committed vs actual vs forecast summary.
5. Family A, Family B, and shared infrastructure status cards.
6. Missing documents panel.
7. Open risks panel.
8. Pending approvals panel.
9. Quick actions: upload document, add invoice, add decision, add risk.

Mocked backend calls:

1. `GET /api/projects/:projectId/dashboard`
2. `GET /api/projects/:projectId/deadlines/upcoming`
3. `GET /api/projects/:projectId/blockers`
4. `GET /api/projects/:projectId/notifications`

Acceptance criteria:

1. Dashboard makes the two-family/single-land complexity visible within one screen.
2. User can identify private vs shared blockers.
3. Clicking a dashboard item deep-links to the relevant route with filters applied.
4. Mock scenario changes produce visibly different dashboard states.

### Milestone 5: Documents Repository

Goal: support the evidence-heavy nature of the project early.

Deliverables:

1. Document list with filters by category, scope, status, owner, related entity, and missing/expired state.
2. Document detail drawer.
3. Upload dialog with metadata capture.
4. Version history UI.
5. Missing-document checklist by phase.
6. Validation status workflow.
7. Mock upload progress and processing status.

Mocked backend calls:

1. `GET /api/projects/:projectId/documents`
2. `GET /api/projects/:projectId/document-checklist`
3. `POST /api/projects/:projectId/documents/upload-session`
4. `POST /api/projects/:projectId/documents/:documentId/commands/validate`
5. `GET /api/projects/:projectId/documents/:documentId/download-url`

Acceptance criteria:

1. User can upload a mocked document and see progress.
2. User can classify a document as Family A private, Family B private, shared, or professional-only.
3. User can see which decisions or tasks rely on a document version.
4. Permission-limited scenario hides private documents from unauthorized users.

### Milestone 6: Budget, Cost Allocation, and Settlement Ledger

Goal: prove the financial core of the two-family project.

Deliverables:

1. Budget overview by global, Family A, Family B, and shared scopes.
2. Budget category table.
3. Invoice list.
4. Cost allocation editor.
5. Settlement ledger.
6. Cash forecast shell.
7. Loan summary cards.
8. Tax estimate cards.
9. Version-conflict handling for budget edits.

Mocked backend calls:

1. `GET /api/projects/:projectId/budget/summary`
2. `GET /api/projects/:projectId/budget/lines`
3. `GET /api/projects/:projectId/invoices`
4. `POST /api/projects/:projectId/budget/commands/update-allocation`
5. `POST /api/projects/:projectId/invoices/commands/create-invoice`
6. `GET /api/projects/:projectId/settlement-ledger`

Acceptance criteria:

1. No invoice can be marked complete unless allocations total 100 percent.
2. User can model a shared driveway cost split 50/50 and see each family balance update.
3. User can assign a private upgrade entirely to one family.
4. User sees a clear warning when a shared cost requires both-family approval.

### Milestone 7: Legal-Structure Scenario Comparison

Goal: make the core differentiator tangible before legal automation exists.

Deliverables:

1. Scenario list: indivision, parcel division, lotissement, PCVD, horizontal co-ownership, SCI, mixed structure.
2. Scenario comparison matrix.
3. Criteria scoring by independence, resale ease, financing compatibility, simplicity, shared-cost efficiency, and governance burden.
4. Assumptions editor.
5. Open questions panel for notaire, bank, architect, municipality, and insurer.
6. Professional validation status.
7. Adopt-scenario command with decision record.

Mocked backend calls:

1. `GET /api/projects/:projectId/legal-structure/scenarios`
2. `POST /api/projects/:projectId/legal-structure/commands/update-scenario-assumption`
3. `POST /api/projects/:projectId/legal-structure/commands/request-validation`
4. `POST /api/projects/:projectId/legal-structure/commands/adopt-scenario`
5. `GET /api/projects/:projectId/legal-structure/notaire-questions`

Acceptance criteria:

1. Scenario drafts do not mutate active project facts until adopted.
2. User can compare at least three structures side by side.
3. UI never presents uncertain legal choices as definitive advice.
4. Adopted scenario creates a mocked decision record and audit event.

### Milestone 8: Urbanism and Permit Deadlines

Goal: make administrative risk and deadline tracking visible.

Deliverables:

1. Planning facts summary.
2. Authorization scenario list.
3. Permit dossier checklist.
4. Deadline timeline.
5. Field posting evidence panel.
6. Rule source and validation status display.
7. DOC and DAACT milestone cards.

Mocked backend calls:

1. `GET /api/projects/:projectId/urbanism/summary`
2. `GET /api/projects/:projectId/urbanism/rules`
3. `GET /api/projects/:projectId/authorizations`
4. `POST /api/projects/:projectId/authorizations/commands/create`
5. `POST /api/projects/:projectId/deadlines/commands/verify`
6. `POST /api/projects/:projectId/field-posting/commands/add-evidence`

Acceptance criteria:

1. User can see permit deadlines with source, uncertainty, and responsible owner.
2. User can mark a deadline as professionally verified in mock mode.
3. Field posting requires date and photo evidence placeholders.
4. Two-house permit strategy is visible as a planning scenario, not buried in notes.

### Milestone 9: Decisions, Approvals, Shared Assets, and Risks

Goal: close the first MVP loop for two-family governance.

Deliverables:

1. Decision register.
2. Approval workflow UI.
3. Meeting minutes shell.
4. Shared asset register.
5. Shared asset detail page.
6. Risk register.
7. Risk templates for two-family/single-land projects.
8. Risk acceptance workflow.

Mocked backend calls:

1. `GET /api/projects/:projectId/decisions`
2. `POST /api/projects/:projectId/decisions/commands/create`
3. `POST /api/projects/:projectId/approvals/commands/vote`
4. `GET /api/projects/:projectId/shared-assets`
5. `POST /api/projects/:projectId/shared-assets/commands/update-maintenance-rule`
6. `GET /api/projects/:projectId/risks`
7. `POST /api/projects/:projectId/risks/commands/accept`

Acceptance criteria:

1. Shared costs above a configured threshold require the correct mocked approvals.
2. Shared assets without legal ownership or maintenance rules appear as dashboard blockers.
3. Risk acceptance creates a decision record.
4. Permission-limited users can view only authorized decisions and risks.

### Milestone 10: P1 Operational Modules

Goal: extend the MVP into construction operations once the governance and finance core is usable.

Deliverables:

1. Land due diligence detail screens.
2. Contracts and professionals tracker.
3. Insurance certificate verification UI.
4. Schedule with House A, House B, shared infrastructure, and critical path.
5. Site checklist and defect capture.
6. Report/export job tracking shell.

Mocked backend calls:

1. `GET /api/projects/:projectId/land/due-diligence`
2. `GET /api/projects/:projectId/contracts`
3. `POST /api/projects/:projectId/contracts/commands/mark-ready-to-sign`
4. `GET /api/projects/:projectId/schedule`
5. `POST /api/projects/:projectId/defects/commands/create`
6. `POST /api/projects/:projectId/reports/jobs`
7. `GET /api/projects/:projectId/reports/jobs/:jobId`

Acceptance criteria:

1. Contractor ready-to-sign can be blocked by mocked insurance mismatch.
2. Schedule clearly separates House A, House B, and shared infrastructure.
3. Defect capture is mobile-friendly.
4. Report export displays asynchronous job progress and expiring download links.

## 6. Vertical Slice Definition of Done

Every UI slice is complete only when it includes:

1. Lazy route or child route.
2. Page container component.
3. Domain facade.
4. Typed DTOs.
5. View model mapping.
6. Mock handler.
7. At least one realistic fixture.
8. Loading state.
9. Empty state.
10. Error state.
11. Permission-denied state where relevant.
12. Happy-path interaction.
13. Validation failure interaction where relevant.
14. Command mutation where relevant.
15. Unit tests for facade or mapper.
16. Component tests for important UI states.
17. One e2e smoke path for P0 routes.

## 7. Mock API Endpoint Matrix for P0

| Feature         | Endpoint                                                                | Purpose                   | Mock states                                      |
| --------------- | ----------------------------------------------------------------------- | ------------------------- | ------------------------------------------------ |
| Shell           | `GET /api/me`                                                           | Current user and roles    | owner, professional, read-only                   |
| Shell           | `GET /api/projects/:projectId/shell`                                    | Project header context    | normal, missing phase, permission-limited        |
| Shell           | `GET /api/projects/:projectId/permissions`                              | Object/action permissions | full, family-private, professional-limited       |
| Dashboard       | `GET /api/projects/:projectId/dashboard`                                | Aggregated status         | healthy, blocked, dispute, incomplete            |
| Onboarding      | `POST /api/projects/commands/create-project`                            | Create project            | success, validation error                        |
| Documents       | `GET /api/projects/:projectId/documents`                                | Document list             | populated, missing required, permission-filtered |
| Documents       | `POST /api/projects/:projectId/documents/upload-session`                | Upload start              | success, file too large, network failure         |
| Budget          | `GET /api/projects/:projectId/budget/summary`                           | Budget cards              | balanced, over budget, missing allocations       |
| Budget          | `POST /api/projects/:projectId/budget/commands/update-allocation`       | Allocation mutation       | success, totals invalid, version conflict        |
| Legal structure | `GET /api/projects/:projectId/legal-structure/scenarios`                | Scenario comparison       | unknown, professionally validated, blocked       |
| Legal structure | `POST /api/projects/:projectId/legal-structure/commands/adopt-scenario` | Adopt scenario            | success, missing approval, validation required   |
| Urbanism        | `GET /api/projects/:projectId/urbanism/rules`                           | Planning rules            | verified, uncertain, ABF risk                    |
| Urbanism        | `GET /api/projects/:projectId/authorizations`                           | Permit workflows          | draft, submitted, waiting, recourse period       |
| Decisions       | `GET /api/projects/:projectId/decisions`                                | Decision register         | none, pending, approved, rejected                |
| Decisions       | `POST /api/projects/:projectId/approvals/commands/vote`                 | Approval vote             | approved, rejected, missing second family        |
| Shared assets   | `GET /api/projects/:projectId/shared-assets`                            | Shared asset list         | complete, missing ownership, missing maintenance |
| Risks           | `GET /api/projects/:projectId/risks`                                    | Risk register             | low, high, accepted, overdue mitigation          |

## 8. UI Build Order by Route

Build routes in this order:

1. `/projects` and `/projects/:projectId/dashboard`.
2. `/projects/new`.
3. `/projects/:projectId/documents`.
4. `/projects/:projectId/budget-financing`.
5. `/projects/:projectId/legal-structure`.
6. `/projects/:projectId/urbanism-permits`.
7. `/projects/:projectId/decisions-meetings`.
8. `/projects/:projectId/shared-assets`.
9. `/projects/:projectId/risks`.
10. `/projects/:projectId/contracts-professionals`.
11. `/projects/:projectId/land`.
12. `/projects/:projectId/schedule`.
13. `/projects/:projectId/site-quality`.
14. `/projects/:projectId/reports-exports`.
15. `/projects/:projectId/procurement-materials`.
16. `/projects/:projectId/design-technical`.
17. `/projects/:projectId/settings`.

Settings appears late in the visual build order but must have early technical stubs for permissions, roles, and governance defaults.

## 9. Testing Plan While Backend Is Mocked

Testing must prove that UI behavior is not coupled to fixture imports.

Test layers:

1. Unit tests for model mappers, validators, and domain facades.
2. Component tests for shared UI states.
3. Route smoke tests for navigation and guards.
4. Playwright e2e tests with mock backend enabled.
5. Contract-style tests that verify mock responses match DTO schemas.

Required P0 e2e scenarios:

1. Create a two-family/single-land project through onboarding.
2. View dashboard blockers for missing legal structure and shared asset rules.
3. Upload a shared document and validate it.
4. Add a shared driveway invoice and split it 50/50.
5. Compare legal structures and adopt one through a decision workflow.
6. Mark a permit deadline as professionally verified.
7. Vote on a shared decision as both families.
8. Accept a high risk and verify the decision record exists.

## 10. Backend Replacement Strategy

Mocks must be replaceable route by route.

Replacement process:

1. Freeze DTO contract for one feature.
2. Compare mock endpoint with backend endpoint.
3. Add real endpoint behind the same API client method.
4. Run feature tests against mock mode.
5. Run the same feature tests against real mode in an integration environment.
6. Remove or downgrade only obsolete mock behavior; keep mock scenarios useful for UI regression tests.
7. Keep error, latency, permission, and version-conflict mocks even after real backend exists.

Do not change component code when switching from mock to real backend. If component code must change, the API boundary is too leaky.

## 11. Team Workflow

Recommended workflow for each feature:

1. Designer or frontend developer drafts screen states using realistic fixture data.
2. Frontend developer defines DTOs and mock handlers.
3. Frontend developer builds facade and page components.
4. Product review happens in mock scenario mode.
5. Backend developer implements the endpoint against the agreed DTO.
6. Frontend switches the feature from mock to real endpoint in an integration environment.
7. Tests are run against both modes before closing the slice.

Feature handoff artifact:

1. Route path.
2. DTO definitions.
3. Mock endpoint list.
4. UI states covered.
5. Commands and validations.
6. Permission assumptions.
7. Open backend questions.
8. Acceptance criteria.

## 12. First Two-Week Sprint Proposal

Sprint goal: produce a demoable Angular shell with mocked project data and the first two-family onboarding path.

Scope:

1. Scaffold Angular 22 app.
2. Add strict linting and formatting.
3. Add app shell, top navigation, sidebar, project switcher, and scope selector.
4. Add lazy route placeholders for all product sections.
5. Add mock API foundation with `GET /api/me`, `GET /api/projects`, `GET /api/projects/:projectId/shell`, and `GET /api/projects/:projectId/permissions`.
6. Add design tokens and first shared components: status badge, scope badge, deadline badge, money amount, empty state, error state.
7. Add onboarding wizard skeleton with mocked create-project command.
8. Add one Playwright smoke test for opening the app, selecting a project, and navigating to dashboard.

Sprint exit criteria:

1. App runs locally in mock mode.
2. User can navigate all top-level routes.
3. User can start onboarding and create a mocked two-family project.
4. Mock project shell updates after creation.
5. Tests pass for route smoke path and core mapper/facade behavior.

## 13. Early Technical Decisions to Make Before Coding

1. Angular CLI workspace or Nx workspace.
2. Styling stack: plain SCSS with design tokens, Angular Material, Tailwind, or another component foundation.
3. Mocking library: MSW preferred, Angular HTTP interceptor acceptable if MSW is not suitable.
4. Test runner setup for Angular 22.
5. E2E test framework and browser targets.
6. Auth provider assumption for UI mocks.
7. Translation approach for French-first UI.
8. Charting and table libraries, if any.
9. Map rendering library and how it will be lazy-loaded.
10. Document preview strategy.

Default recommendation if no constraint exists:

1. Angular CLI first unless monorepo needs are immediate.
2. SCSS design tokens plus a small set of custom components for the MVP.
3. MSW for mock backend calls.
4. Playwright for e2e smoke and workflow tests.
5. Angular built-in i18n or Transloco, selected before user-facing strings multiply.
