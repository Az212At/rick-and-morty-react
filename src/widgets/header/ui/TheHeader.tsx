import { NavLink, Link } from "react-router-dom";
import logo from "@/shared/assets/img/logoA.svg";
import rickImage from "@/shared/assets/img/HighlightImageRick.png";

export default function TheHeader() {
  return (
    <header className="the-header">
      <div className="the-header__container">
        <div className="the-header__top">
          <Link
            to="/characters"
            className="the-header__brand"
            aria-label="Рик и Морти — персонажи"
          >
            <img
              src={logo}
              alt="Rick and Morty"
              className="the-header__logo"
              width="180"
              height="54"
            />
          </Link>
          <nav className="the-header__nav" aria-label="Основная навигация">
            <NavLink
              to="/characters"
              className={({ isActive }) =>
                `the-header__link${isActive ? " is-active" : ""}`
              }
            >
              Персонажи
            </NavLink>
            <NavLink
              to="/episodes"
              className={({ isActive }) =>
                `the-header__link${isActive ? " is-active" : ""}`
              }
            >
              Эпизоды
            </NavLink>
          </nav>
        </div>
        <div className="the-header__main">
          <div className="the-header__text">
            <p className="the-header__eyebrow">Вселенная Рика и Морти</p>
            <h1 className="the-header__title">
              Всё в одном <span>месте</span>.
            </h1>
            <p className="the-header__subtitle">
              Персонажи и эпизоды любимой мультивселенной
            </p>
          </div>
          <div className="the-header__image">
            <img src={rickImage} alt="Рик Санчес" fetchPriority="high" />
          </div>
        </div>
      </div>
    </header>
  );
}
