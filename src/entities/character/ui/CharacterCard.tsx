import type { Character } from "../model/types";
import humanIcon from "@/shared/assets/icons/icon-human.svg";
import planetIcon from "@/shared/assets/icons/icon-planet.svg";
import infoIcon from "@/shared/assets/icons/icon-info.svg";

interface CharacterCardProps {
  character: Character;
  onDetails: (character: Character) => void;
}

export default function CharacterCard({
  character,
  onDetails,
}: CharacterCardProps) {
  return (
    <article className="character-card">
      <img
        src={character.image}
        alt={character.name}
        className="character-card__image"
        width="300"
        height="300"
        loading="lazy"
        decoding="async"
      />
      <div className="character-card__body">
        <h3 className="character-card__name">{character.name}</h3>
        <p className="character-card__row">
          <span
            className={`character-card__dot character-card__dot--${character.status.toLowerCase()}`}
            aria-hidden="true"
          />
          <span>
            <span className="sr-only">Статус: </span>
            {character.status}
          </span>
        </p>
        <p className="character-card__row">
          <img src={humanIcon} alt="" width="16" height="16" />
          <span>
            <span className="sr-only">Вид: </span>
            {character.species}
          </span>
        </p>
        <p className="character-card__row">
          <img src={planetIcon} alt="" width="16" height="16" />
          <span>
            <span className="sr-only">Происхождение: </span>
            {character.origin.name}
          </span>
        </p>
        <button
          type="button"
          className="character-card__more-btn"
          onClick={() => onDetails(character)}
          aria-label={`Узнать больше: ${character.name}`}
        >
          <img src={infoIcon} alt="" width="16" height="16" />
          Узнать больше
        </button>
      </div>
    </article>
  );
}
