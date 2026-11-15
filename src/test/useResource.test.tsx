import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useResource } from "@/shared/lib/useResource";
import { jsonResponse } from "./fixtures";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

describe("useResource", () => {
  it("aborts an old request and prevents late data from replacing the current result", async () => {
    const oldRequest = deferred<Response>();
    const currentRequest = deferred<Response>();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockReturnValueOnce(oldRequest.promise)
      .mockReturnValueOnce(currentRequest.promise);
    vi.stubGlobal("fetch", fetchMock);

    const { result, rerender } = renderHook(
      ({ path }) => useResource<{ name: string }>(path),
      { initialProps: { path: "/character/1" } }
    );
    rerender({ path: "/character/2" });

    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      currentRequest.resolve(jsonResponse({ name: "Morty Smith" }));
    });
    await waitFor(() => expect(result.current.data?.name).toBe("Morty Smith"));

    await act(async () => {
      oldRequest.resolve(jsonResponse({ name: "Rick Sanchez" }));
    });
    expect(result.current.data?.name).toBe("Morty Smith");
    expect(result.current.error).toBeNull();
  });

  it("treats an API 404 as no results instead of a connection error", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(
          jsonResponse({ error: "There is nothing here" }, 404)
        )
    );
    const { result } = renderHook(() => useResource("/character?name=missing"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isNotFound).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it("recovers from a failed request when retrying", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("Network failed"))
      .mockResolvedValueOnce(jsonResponse({ name: "Rick Sanchez" }));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() =>
      useResource<{ name: string }>("/character/1")
    );

    await waitFor(() => expect(result.current.error).toBeTruthy());
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.data?.name).toBe("Rick Sanchez"));
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("aborts an in-flight request on unmount", () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockReturnValue(new Promise<Response>(() => {}));
    vi.stubGlobal("fetch", fetchMock);
    const { unmount } = renderHook(() => useResource("/character"));
    const signal = fetchMock.mock.calls[0][1]?.signal;

    expect(signal?.aborted).toBe(false);
    unmount();
    expect(signal?.aborted).toBe(true);
  });
});
