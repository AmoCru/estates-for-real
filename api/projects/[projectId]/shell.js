const fallbackProject = {
  id: '42',
  name: 'Two families, one land',
  phase: 'Feasibility and legal structure',
  role: 'Family A representative',
  scope: 'Shared project view',
};

const fallbackMetrics = [
  { label: 'Missing documents', value: '14', status: 'warning' },
  { label: 'Shared blockers', value: '3', status: 'blocked' },
  { label: 'Pending approvals', value: '5', status: 'warning' },
];

const navigationItems = [
  { label: 'Dashboard', segment: 'dashboard', priority: 'P0' },
  { label: 'Onboarding', path: '/projects/new', priority: 'P0' },
  { label: 'Documents', segment: 'documents', priority: 'P0' },
  { label: 'Budget and financing', segment: 'budget-financing', priority: 'P0' },
  { label: 'Legal structure', segment: 'legal-structure', priority: 'P0' },
  { label: 'Urbanism and permits', segment: 'urbanism-permits', priority: 'P0' },
  { label: 'Decisions and meetings', segment: 'decisions-meetings', priority: 'P0' },
  { label: 'Shared assets', segment: 'shared-assets', priority: 'P0' },
  { label: 'Risks', segment: 'risks', priority: 'P0' },
  { label: 'Contracts and professionals', segment: 'contracts-professionals', priority: 'P1' },
  { label: 'Land', segment: 'land', priority: 'P1' },
  { label: 'Schedule', segment: 'schedule', priority: 'P1' },
  { label: 'Site and quality', segment: 'site-quality', priority: 'P1' },
  { label: 'Reports and exports', segment: 'reports-exports', priority: 'P1' },
  { label: 'Procurement and materials', segment: 'procurement-materials', priority: 'P2' },
  { label: 'Design and technical', segment: 'design-technical', priority: 'P2' },
  { label: 'Settings', segment: 'settings', priority: 'P0' },
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
    throw new Error(`Supabase project lookup failed: ${supabaseResponse.status} ${detail}`);
  }

  const rows = await supabaseResponse.json();
  const row = Array.isArray(rows) ? rows[0] : null;

  return row ? normalizeProject(row, projectId) : null;
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ error: 'Method not allowed' });
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
    return response.status(500).json({ error: 'Unable to load project shell' });
  }
}
