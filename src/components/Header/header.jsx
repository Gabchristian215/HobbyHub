import { NavLink } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header className="site-header">
      <NavLink className="site-header__brand" to="/">
        HobbyHub
      </NavLink>

      <div className="site-header__search">
        <label htmlFor="hobby-filter">Search hobbies</label>
        <input
          id="hobby-filter"
          name="hobby-filter"
          placeholder="Search or filter"
          type="search"
        />
      </div>

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
        <NavLink
          className={({ isActive }) =>
            isActive ? "site-header__link site-header__link--active" : "site-header__link"
          }
          to="/post"
        >
          Post
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
