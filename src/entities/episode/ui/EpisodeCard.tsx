import type { Episode } from "../model/types";

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <article className="episode-card">
      <p className="episode-card__code">
        <span className="sr-only">Сезон и эпизод: </span>
        {episode.episode}
      </p>
      <h3 className="episode-card__name">{episode.name}</h3>
      <p className="episode-card__date">
        <span className="sr-only">Дата выхода: </span>
        {episode.air_date}
      </p>
      <p className="episode-card__characters">
        Персонажей: {episode.characters.length}
      </p>
    </article>
  );
}
