import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="empty-state" aria-labelledby="not-found-title">
      <p className="eyebrow">404 · Неизвестное измерение</p>
      <h2 id="not-found-title">Страница не найдена</h2>
      <p>В этом измерении пока ничего нет. Вернитесь к персонажам.</p>
      <Link className="button" to="/characters">
        К персонажам
      </Link>
    </section>
  );
}
