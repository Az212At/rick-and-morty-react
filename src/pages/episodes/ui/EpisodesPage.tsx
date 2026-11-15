import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { EpisodeCard, episodeListPath, type Episode } from "@/entities/episode";
import type { PaginatedResponse } from "@/shared/api/types";
import { useResource } from "@/shared/lib/useResource";
import { readPage } from "@/shared/lib/pagination";
import Pagination from "@/shared/ui/Pagination";
import QueryState from "@/shared/ui/QueryState";

export default function EpisodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPage(searchParams.get("page"));
  const name = searchParams.get("name") ?? "";
  const { data, isLoading, error, retry } = useResource<
    PaginatedResponse<Episode>
  >(episodeListPath({ page, name }));
  const episodes = data?.results ?? [];

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = String(
      new FormData(event.currentTarget).get("name") ?? ""
    ).trim();
    setSearchParams(nextName ? { name: nextName } : {});
  }

  function changePage(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams);
  }

  return (
    <section className="catalog" aria-labelledby="episodes-title">
      <div className="catalog__heading">
        <div>
          <p className="eyebrow">Ещё одно приключение</p>
          <h2 id="episodes-title">Эпизоды</h2>
        </div>
        {data && <p className="catalog__count">Найдено: {data.info.count}</p>}
      </div>
      <form
        className="filters"
        key={searchParams.toString()}
        onSubmit={handleSearch}
        role="search"
        aria-label="Поиск эпизодов"
      >
        <div className="field field--search">
          <label htmlFor="episode-name">Поиск по имени</label>
          <input
            id="episode-name"
            name="name"
            type="search"
            placeholder="Например, Pilot"
            defaultValue={name}
            maxLength={100}
          />
        </div>
        <button className="button" type="submit">
          Найти
        </button>
        {(name || page > 1) && (
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
          isEmpty={!episodes.length}
          onRetry={retry}
          onReset={() => setSearchParams({})}
        />
        {data && !isLoading && !error && episodes.length > 0 && (
          <>
            <div className="episode-grid">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
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
