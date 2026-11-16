import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./header.css";

function Header() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const query = pathname === "/" ? (searchParams.get("q") ?? "") : "";

  function handleSearch(event) {
    const value = event.target.value;
    const target = value ? `/?q=${encodeURIComponent(value)}` : "/";
    // Replace history while typing on the feed so Back isn't flooded with keystrokes.
    navigate(target, { replace: pathname === "/" });
  }

  return (
    <header className="site-header">
      <NavLink className="site-header__brand" to="/">
        HobbyHub
      </NavLink>

      <form className="site-header__search" role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="hobby-filter">Search posts by title</label>
        <input
          id="hobby-filter"
          name="hobby-filter"
          onChange={handleSearch}
          placeholder="Search posts by title"
          type="search"
          value={query}
        />
      </form>

      <nav aria-label="Main navigation" className="site-header__nav">
        <NavLink
          className={({ isActive }) =>
            isActive ? "site-header__link site-header__link--active" : "site-header__link"
          }
          end
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "site-header__link site-header__link--active" : "site-header__link"
          }
          to="/create"
        >
          Create
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
