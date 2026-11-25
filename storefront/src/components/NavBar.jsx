import { Link, NavLink } from 'react-router-dom';

export default function NavBar({ cartCount, user, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <span>E-Commerce MVP</span>
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
            to="/cart"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Sepetim
          </NavLink>

          {user ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {user.name}
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Giriş Yap
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Kayıt Ol
              </NavLink>
            </>
          )}

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title="Tema Değiştir"
          >
            {theme === 'dark' ? '☀️ Açık Tema' : '🌙 Koyu Tema'}
          </button>

          <Link to="/cart" className="cart-pill">
            Sepet: {cartCount}
          </Link>
        </nav>
      </div>
    </header>
  );
}