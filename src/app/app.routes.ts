import { Routes } from '@angular/router';

import { PlaceholderPage } from './pages/placeholder-page';

const projectPage = (title: string, description: string) => ({
	component: PlaceholderPage,
	data: { title, description },
});

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'projects/demo-project/dashboard' },
	{ path: 'projects', pathMatch: 'full', redirectTo: 'projects/demo-project/dashboard' },
	{
		path: 'projects/new',
		...projectPage(
			'Project onboarding',
			'Create a two-family, single-land construction project from mocked template data.',
		),
	},
	{
		path: 'projects/:projectId/dashboard',
		...projectPage('Dashboard', 'Project phase, blockers, deadlines, approvals, budget status, and shared risks.'),
	},
	{
		path: 'projects/:projectId/documents',
		...projectPage('Documents', 'Evidence repository for permits, contracts, insurance, invoices, and handover files.'),
	},
	{
		path: 'projects/:projectId/budget-financing',
		...projectPage('Budget and financing', 'Private and shared budgets, allocations, loans, taxes, and settlement ledger.'),
	},
	{
		path: 'projects/:projectId/legal-structure',
		...projectPage('Legal structure', 'Compare indivision, parcel division, SCI, PCVD, and shared ownership scenarios.'),
	},
	{
		path: 'projects/:projectId/urbanism-permits',
		...projectPage('Urbanism and permits', 'Planning rules, permit workflows, deadline tracking, and posting evidence.'),
	},
	{
		path: 'projects/:projectId/decisions-meetings',
		...projectPage('Decisions and meetings', 'Governance, approvals, meeting minutes, and two-family decision records.'),
	},
	{
		path: 'projects/:projectId/shared-assets',
		...projectPage('Shared assets', 'Access, networks, drainage, gates, maintenance rules, and shared infrastructure.'),
	},
	{
		path: 'projects/:projectId/risks',
		...projectPage('Risks', 'Risk register for legal, finance, planning, technical, schedule, and governance issues.'),
	},
	{
		path: 'projects/:projectId/contracts-professionals',
		...projectPage('Contracts and professionals', 'CCMI, contractors, notaire, architect, insurance, and ready-to-sign checks.'),
	},
	{
		path: 'projects/:projectId/land',
		...projectPage('Land', 'Parcel facts, acquisition, boundaries, easements, utilities, and due diligence.'),
	},
	{
		path: 'projects/:projectId/schedule',
		...projectPage('Schedule', 'House A, House B, shared infrastructure, milestones, and critical path.'),
	},
	{
		path: 'projects/:projectId/site-quality',
		...projectPage('Site and quality', 'Site checklists, inspections, defects, reception, and warranty follow-up.'),
	},
	{
		path: 'projects/:projectId/reports-exports',
		...projectPage('Reports and exports', 'Notaire pack, bank dossier, budget reports, reception report, and archive jobs.'),
	},
	{
		path: 'projects/:projectId/procurement-materials',
		...projectPage('Procurement and materials', 'Material catalog, purchase orders, deliveries, stock, and substitutions.'),
	},
	{
		path: 'projects/:projectId/design-technical',
		...projectPage('Design and technical', 'Plans, technical studies, RE2020, soil, sanitation, and compliance attestations.'),
	},
	{
		path: 'projects/:projectId/settings',
		...projectPage('Settings', 'Roles, permissions, governance defaults, notifications, integrations, and privacy.'),
	},
	{ path: '**', redirectTo: 'projects/demo-project/dashboard' },
];
