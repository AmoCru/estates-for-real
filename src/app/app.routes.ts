import { Routes } from '@angular/router';

import { PlaceholderPage } from './pages/placeholder-page';

const projectPage = (title: string, description: string) => ({
  component: PlaceholderPage,
  data: { title, description },
});

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects/42/dashboard' },
  { path: 'projects', pathMatch: 'full', redirectTo: 'projects/42/dashboard' },
  {
    path: 'projects/new',
    ...projectPage(
      'Initialisation du projet',
      'Créer un projet de construction pour deux familles sur un seul terrain à partir de données de démonstration.',
    ),
  },
  {
    path: 'projects/:projectId/dashboard',
    ...projectPage(
      'Tableau de bord',
      'Phase du projet, blocages, échéances, validations, état du budget et risques partagés.',
    ),
  },
  {
    path: 'projects/:projectId/documents',
    ...projectPage(
      'Documents',
      'Référentiel des justificatifs pour les permis, contrats, assurances, factures et dossiers de réception.',
    ),
  },
  {
    path: 'projects/:projectId/budget-financing',
    loadComponent: () =>
      import('./domains/budget-financing/budget-financing.page').then(
        (module) => module.BudgetFinancingPage,
      ),
  },
  {
    path: 'projects/:projectId/legal-structure',
    ...projectPage(
      'Structure juridique',
      "Comparer l'indivision, la division parcellaire, la SCI, le PCVD et les scénarios de propriété partagée.",
    ),
  },
  {
    path: 'projects/:projectId/urbanism-permits',
    ...projectPage(
      'Urbanisme et permis',
      "Règles d'urbanisme, démarches de permis, suivi des délais et preuves d'affichage.",
    ),
  },
  {
    path: 'projects/:projectId/decisions-meetings',
    ...projectPage(
      'Décisions et réunions',
      'Gouvernance, validations, comptes rendus et registre des décisions entre les deux familles.',
    ),
  },
  {
    path: 'projects/:projectId/shared-assets',
    ...projectPage(
      'Infrastructures partagées',
      "Accès, réseaux, drainage, portails, règles d'entretien et équipements communs.",
    ),
  },
  {
    path: 'projects/:projectId/risks',
    ...projectPage(
      'Risques',
      'Registre des risques juridiques, financiers, administratifs, techniques, calendaires et de gouvernance.',
    ),
  },
  {
    path: 'projects/:projectId/contracts-professionals',
    ...projectPage(
      'Contrats et professionnels',
      'CCMI, entreprises, notaire, architecte, assurances et contrôles avant signature.',
    ),
  },
  {
    path: 'projects/:projectId/land',
    ...projectPage(
      'Terrain',
      'Données de parcelle, acquisition, limites, servitudes, réseaux et vérifications préalables.',
    ),
  },
  {
    path: 'projects/:projectId/schedule',
    ...projectPage(
      'Planning',
      'Maison A, maison B, infrastructures partagées, jalons et chemin critique.',
    ),
  },
  {
    path: 'projects/:projectId/site-quality',
    ...projectPage(
      'Chantier et qualité',
      'Checklists de chantier, inspections, réserves, réception et suivi des garanties.',
    ),
  },
  {
    path: 'projects/:projectId/reports-exports',
    ...projectPage(
      'Rapports et exports',
      'Dossier notaire, dossier bancaire, rapports budgétaires, procès-verbal de réception et archivage.',
    ),
  },
  {
    path: 'projects/:projectId/procurement-materials',
    ...projectPage(
      'Achats et matériaux',
      'Catalogue matériaux, bons de commande, livraisons, stock et substitutions.',
    ),
  },
  {
    path: 'projects/:projectId/design-technical',
    ...projectPage(
      'Conception et technique',
      'Plans, études techniques, RE2020, sol, assainissement et attestations de conformité.',
    ),
  },
  {
    path: 'projects/:projectId/settings',
    ...projectPage(
      'Paramètres',
      'Rôles, droits, règles de gouvernance par défaut, notifications, intégrations et confidentialité.',
    ),
  },
  { path: '**', redirectTo: 'projects/42/dashboard' },
];
