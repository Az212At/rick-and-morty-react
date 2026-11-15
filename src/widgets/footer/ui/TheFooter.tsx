import { Link } from "react-router-dom";
import logo from "@/shared/assets/img/logoA.svg";

export default function TheFooter() {
  return (
    <footer className="the-footer">
      <div className="the-footer__container">
        <Link to="/characters" aria-label="К списку персонажей">
          <img
            src={logo}
            alt="Rick and Morty"
            className="the-footer__logo"
            width="165"
            height="50"
          />
        </Link>
        <p className="the-footer__text">
          {new Date().getFullYear()} · Данные{" "}
          <a
            href="https://rickandmortyapi.com/"
            target="_blank"
            rel="noreferrer"
          >
            The Rick and Morty API
          </a>
        </p>
      </div>
    </footer>
  );
}
