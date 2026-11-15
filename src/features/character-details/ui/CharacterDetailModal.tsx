import { useId } from "react";
import type { Character } from "@/entities/character/model/types";
import MainModal from "@/shared/ui/MainModal";
import planetIcon from "@/shared/assets/icons/icon-planet.svg";
import mapPinIcon from "@/shared/assets/icons/map-pin-1.svg";

interface CharacterDetailModalProps {
  character: Character | null;
  onClose: () => void;
}

export default function CharacterDetailModal({
  character,
  onClose,
}: CharacterDetailModalProps) {
  const titleId = useId();

  return (
    <MainModal
      isOpen={character !== null}
      onClose={onClose}
      labelledBy={titleId}
    >
      {character && (
        <div className="character-modal">
          <button
            type="button"
            className="character-modal__close"
            aria-label="Закрыть информацию о персонаже"
            onClick={onClose}
          >
            ×
          </button>
          <div className="character-modal__content">
            <img
              src={character.image}
              alt={character.name}
              className="character-modal__image"
              width="300"
              height="300"
            />
            <div className="character-modal__body">
              <p className="character-modal__eyebrow">
                Персонаж #{character.id}
              </p>
              <h2 id={titleId} className="character-modal__name">
                {character.name}
              </h2>
              <p className="character-modal__episodes">
                Появлений в эпизодах: {character.episode.length}
              </p>
              <dl className="character-modal__badges">
                <div>
                  <dt>Статус</dt>
                  <dd>
                    <span
                      className={`character-card__dot character-card__dot--${character.status.toLowerCase()}`}
                      aria-hidden="true"
                    />
                    {character.status}
                  </dd>
                </div>
                <div>
                  <dt>Вид</dt>
                  <dd>{character.species}</dd>
                </div>
                <div>
                  <dt>Пол</dt>
                  <dd>{character.gender}</dd>
                </div>
                {character.type && (
                  <div>
                    <dt>Тип</dt>
                    <dd>{character.type}</dd>
                  </div>
                )}
              </dl>
              <div className="character-modal__cards">
                <div className="character-modal__card">
                  <img src={planetIcon} alt="" width="24" height="24" />
                  <h3 className="character-modal__card-label">Происхождение</h3>
                  <p className="character-modal__card-value">
                    {character.origin.name}
                  </p>
                </div>
                <div className="character-modal__card">
                  <img src={mapPinIcon} alt="" width="24" height="24" />
                  <h3 className="character-modal__card-label">
                    Местоположение
                  </h3>
                  <p className="character-modal__card-value">
                    {character.location.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainModal>
  );
}
