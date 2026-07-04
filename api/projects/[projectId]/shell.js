const fallbackProject = {
  id: '42',
  name: 'Deux familles, un terrain',
  phase: 'Faisabilité et structure juridique',
  role: 'Représentant famille A',
  scope: 'Vue projet partagée',
};

const fallbackMetrics = [
  { label: 'Documents manquants', value: '14', status: 'warning' },
  { label: 'Blocages partagés', value: '3', status: 'blocked' },
  { label: 'Validations en attente', value: '5', status: 'warning' },
];

const navigationItems = [
  { label: 'Tableau de bord', segment: 'dashboard', priority: 'P0' },
  { label: 'Initialisation', path: '/projects/new', priority: 'P0' },
  { label: 'Documents', segment: 'documents', priority: 'P0' },
  { label: 'Budget et financement', segment: 'budget-financing', priority: 'P0' },
  { label: 'Structure juridique', segment: 'legal-structure', priority: 'P0' },
  { label: 'Urbanisme et permis', segment: 'urbanism-permits', priority: 'P0' },
  { label: 'Décisions et réunions', segment: 'decisions-meetings', priority: 'P0' },
  { label: 'Infrastructures partagées', segment: 'shared-assets', priority: 'P0' },
  { label: 'Risques', segment: 'risks', priority: 'P0' },
  { label: 'Contrats et professionnels', segment: 'contracts-professionals', priority: 'P1' },
  { label: 'Terrain', segment: 'land', priority: 'P1' },
  { label: 'Planning', segment: 'schedule', priority: 'P1' },
  { label: 'Chantier et qualité', segment: 'site-quality', priority: 'P1' },
  { label: 'Rapports et exports', segment: 'reports-exports', priority: 'P1' },
  { label: 'Achats et matériaux', segment: 'procurement-materials', priority: 'P2' },
  { label: 'Conception et technique', segment: 'design-technical', priority: 'P2' },
  { label: 'Paramètres', segment: 'settings', priority: 'P0' },
];

function createNavigation(projectId) {
  return navigationItems.map((item) => ({
    label: item.label,
    path: item.path ?? `/projects/${projectId}/${item.segment}`,
    priority: item.priority,
  }));
}

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? null;
}

function createProjectUrl(projectId) {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return null;
  }

  const projectsTable = process.env.SUPABASE_PROJECTS_TABLE ?? 'projects';
  const projectUrl = new URL(`/rest/v1/${projectsTable}`, supabaseUrl);
  projectUrl.searchParams.set('id', `eq.${projectId}`);
  projectUrl.searchParams.set('select', 'id,name,phase,role,scope');
  projectUrl.searchParams.set('limit', '1');

  return projectUrl;
}

function normalizeProject(row, projectId) {
  return {
    id: String(row.id ?? projectId),
    name: row.name ?? fallbackProject.name,
    phase: row.phase ?? fallbackProject.phase,
    role: row.role ?? fallbackProject.role,
    scope: row.scope ?? fallbackProject.scope,
  };
}

async function readProject(projectId) {
  const supabaseKey = getSupabaseKey();
  const projectUrl = createProjectUrl(projectId);

  if (!supabaseKey || !projectUrl) {
    return null;
  }

  const supabaseResponse = await fetch(projectUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!supabaseResponse.ok) {
    const detail = await supabaseResponse.text();
    throw new Error(
      `La recherche du projet Supabase a échoué : ${supabaseResponse.status} ${detail}`,
    );
  }

  const rows = await supabaseResponse.json();
  const row = Array.isArray(rows) ? rows[0] : null;

  return row ? normalizeProject(row, projectId) : null;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Méthode non autorisée' });
  }

  const requestedProjectId = Array.isArray(request.query.projectId)
    ? request.query.projectId[0]
    : request.query.projectId;
  const projectId = requestedProjectId || fallbackProject.id;

  try {
    const project = (await readProject(projectId)) ?? { ...fallbackProject, id: projectId };

    response.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    return response.status(200).json({
      project,
      navigation: createNavigation(project.id),
      metrics: fallbackMetrics,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Impossible de charger le shell du projet' });
  }
}
