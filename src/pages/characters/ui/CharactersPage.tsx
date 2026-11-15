import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CharacterCard,
  characterListPath,
  type Character,
} from "@/entities/character";
import { CharacterDetailModal } from "@/features/character-details";
import type { PaginatedResponse } from "@/shared/api/types";
import { useResource } from "@/shared/lib/useResource";
import { readPage } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import QueryState from "@/shared/ui/QueryState";

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPage(searchParams.get("page"));
  const name = searchParams.get("name") ?? "";
  const rawStatus = searchParams.get("status") ?? "";
  const status = ["alive", "dead", "unknown"].includes(rawStatus)
    ? rawStatus
    : "";
  const { data, isLoading, error, retry } = useResource<
    PaginatedResponse<Character>
  >(characterListPath({ page, name, status }));
  const characters = data?.results ?? [];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams();
    const nextName = String(formData.get("name") ?? "").trim();
    const nextStatus = String(formData.get("status") ?? "");
    if (nextName) nextParams.set("name", nextName);
    if (nextStatus) nextParams.set("status", nextStatus);
    setSearchParams(nextParams);
  }

  function changePage(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="catalog" aria-labelledby="characters-title">
      <div className="catalog__heading">
        <div>
          <p className="eyebrow">Исследуйте мультивселенную</p>
          <h2 id="characters-title">Персонажи</h2>
        </div>
        {data && <p className="catalog__count">Найдено: {data.info.count}</p>}
      </div>
      <form
        className="filters"
        key={searchParams.toString()}
        onSubmit={handleSearch}
        role="search"
        aria-label="Поиск персонажей"
      >
        <div className="field field--search">
          <label htmlFor="character-name">Поиск по имени</label>
          <input
            id="character-name"
            name="name"
            type="search"
            placeholder="Например, Rick Sanchez"
            defaultValue={name}
            maxLength={100}
          />
        </div>
        <div className="field">
          <label htmlFor="character-status">Статус</label>
          <select id="character-status" name="status" defaultValue={status}>
            <option value="">Любой статус</option>
            <option value="alive">Жив</option>
            <option value="dead">Мёртв</option>
            <option value="unknown">Неизвестен</option>
          </select>
        </div>
        <button className="button" type="submit">
          Найти
        </button>
        {(name || status || page > 1) && (
          <button
            className="button button--secondary"
            type="button"
            onClick={() => setSearchParams({})}
          >
            Сбросить
          </button>
        )}
      </form>
      <div aria-busy={isLoading}>
        <QueryState
          isLoading={isLoading}
          error={error}
          isEmpty={!characters.length}
          onRetry={retry}
          onReset={() => setSearchParams({})}
        />
        {data && !isLoading && !error && characters.length > 0 && (
          <>
            <CharacterResults characters={characters} />
            <Pagination
              page={page}
              pages={data.info.pages}
              onPageChange={changePage}
            />
          </>
        )}
      </div>
    </section>
  );
}

// A new query unmounts the results and closes any details from the old page.
function CharacterResults({ characters }: { characters: Character[] }) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  return (
    <>
      <div className="character-grid">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onDetails={setSelectedCharacter}
          />
        ))}
      </div>
      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </>
  );
}
