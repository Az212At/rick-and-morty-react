import { useEffect, useReducer, useState } from "react";
import { ApiError, request } from "@/shared/api/rick-and-morty-api";

interface ResourceState<T> {
  path: string;
  data: T | null;
  isLoading: boolean;
  isNotFound: boolean;
  error: string | null;
}

function loadingState<T>(path: string): ResourceState<T> {
  return { path, data: null, isLoading: true, isNotFound: false, error: null };
}

/** Cancel obsolete requests, including StrictMode's first development request. */
export function useResource<T>(path: string) {
  const [attempt, retry] = useReducer((value: number) => value + 1, 0);
  const [state, setState] = useState<ResourceState<T>>(() =>
    loadingState(path)
  );

  useEffect(() => {
    const controller = new AbortController();
    setState(loadingState(path));

    request<T>(path, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({
            path,
            data,
            isLoading: false,
            isNotFound: false,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        const isNotFound = error instanceof ApiError && error.status === 404;
        setState({
          path,
          data: null,
          isLoading: false,
          isNotFound,
          error: isNotFound
            ? null
            : "Не удалось загрузить данные. Проверьте подключение и попробуйте снова.",
        });
      });

    return () => controller.abort();
  }, [path, attempt]);

  // Never display the previous page while a new query is starting.
  return { ...(state.path === path ? state : loadingState<T>(path)), retry };
}
