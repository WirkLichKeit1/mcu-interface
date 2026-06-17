import { Outlet, NavLink, useParams } from "react-router-dom";

export default function Layout() {
  const { marathonId } = useParams();
  const base = `/marathon/${marathonId}`;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border flex">
        <NavLink
          to={base}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-gray-300"
            }`
          }
        >
          <HomeIcon />
          <span>Início</span>
        </NavLink>

        <NavLink
          to={`${base}/timeline`}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-gray-300"
            }`
          }
        >
          <ListIcon />
          <span>Timeline</span>
        </NavLink>

        <NavLink
          to={`${base}/stats`}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? "text-accent" : "text-muted hover:text-gray-300"
            }`
          }
        >
          <ChartIcon />
          <span>Estatísticas</span>
        </NavLink>
      </nav>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}