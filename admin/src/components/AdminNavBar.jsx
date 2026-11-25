import { Link, NavLink } from 'react-router-dom';

export default function AdminNavBar({
  theme,
  onToggleTheme,
  isAuthenticated,
  onLogout,
}) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span>E-Commerce Admin</span>
          <span className="badge-role">Panel</span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Ürünler
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Kategoriler
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Kullanıcılar
          </NavLink>

          {isAuthenticated ? (
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onLogout}
            >
              Çıkış Yap
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              Giriş Yap
            </NavLink>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title="Tema Değiştir"
          >
            {theme === 'dark' ? '☀️ Açık Tema' : '🌙 Koyu Tema'}
          </button>
        </nav>
      </div>
    </header>
  );
}