import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "@/app/App";
import { jsonResponse, morty, page, pilot, rick } from "./fixtures";

function renderApp(path = "/characters") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("Rick and Morty app", () => {
  it("opens character details from list data and supports closing with Escape", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(page([rick])));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderApp("/");

    const detailsButton = await screen.findByRole("button", {
      name: "Узнать больше: Rick Sanchez",
    });
    await user.click(detailsButton);
    const dialog = screen.getByRole("dialog", { name: "Rick Sanchez" });
    expect(within(dialog).getByText("Citadel of Ricks")).toBeVisible();
    expect(within(dialog).getByText("Male")).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Browsers translate Escape into a cancellable dialog event.
    fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    expect(document.body.style.overflow).toBe("");
    expect(detailsButton).toHaveFocus();

    await user.click(detailsButton);
    await user.click(
      screen.getByRole("button", { name: "Закрыть информацию о персонаже" })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(detailsButton).toHaveFocus();
  });

  it("paginates characters and navigates to episodes", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async (input) => {
        const url = new URL(String(input));
        if (url.pathname.endsWith("/episode")) {
          return jsonResponse(page([pilot]));
        }
        return jsonResponse(
          url.searchParams.get("page") === "2"
            ? page([morty], 2, 2)
            : page([rick], 1, 2)
        );
      });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderApp();

    await screen.findByRole("heading", { name: "Rick Sanchez" });
    expect(
      screen.getByRole("button", { name: "Предыдущая страница" })
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Следующая страница" })
    );
    await screen.findByRole("heading", { name: "Morty Smith" });
    expect(
      screen.queryByRole("heading", { name: "Rick Sanchez" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Следующая страница" })
    ).toBeDisabled();

    await user.click(screen.getByRole("link", { name: "Эпизоды" }));
    expect(await screen.findByRole("heading", { name: "Pilot" })).toBeVisible();
    expect(screen.getByText("S01E01")).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Morty Smith" })
    ).not.toBeInTheDocument();
  });

  it("submits search and status together and resets pagination for the new query", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => jsonResponse(page([rick], 2, 3)));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderApp("/characters?page=2");
    await screen.findByRole("heading", { name: "Rick Sanchez" });

    await user.type(
      screen.getByRole("searchbox", { name: "Поиск по имени" }),
      "Rick & Morty"
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Статус" }),
      "alive"
    );
    await user.click(screen.getByRole("button", { name: "Найти" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const lastInput = fetchMock.mock.calls.at(-1)?.[0];
    const url = new URL(String(lastInput));
    expect(url.searchParams.get("name")).toBe("Rick & Morty");
    expect(url.searchParams.get("status")).toBe("alive");
    expect(url.searchParams.get("page") ?? "1").toBe("1");
  });

  it("shows an empty search result and can clear filters", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({ error: "There is nothing here" }, 404)
      )
      .mockResolvedValueOnce(jsonResponse(page([rick])));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderApp("/characters?name=missing");

    const reset = await screen.findByRole("button", {
      name: "Сбросить фильтры",
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    await user.click(reset);
    expect(
      await screen.findByRole("heading", { name: "Rick Sanchez" })
    ).toBeVisible();
    const url = new URL(String(fetchMock.mock.calls.at(-1)?.[0]));
    expect(url.searchParams.has("name")).toBe(false);
  });

  it("offers a retry after network failure and renders the recovered episodes", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("Network failed"))
      .mockResolvedValueOnce(jsonResponse(page([pilot])));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderApp("/episodes");

    expect(await screen.findByRole("alert")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Попробовать снова" }));
    expect(await screen.findByRole("heading", { name: "Pilot" })).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each(["characters", "episodes"])(
    "clears an unsaved search draft when resetting %s from page two",
    async (route) => {
      vi.stubGlobal(
        "fetch",
        vi
          .fn<typeof fetch>()
          .mockImplementation(async () =>
            jsonResponse(
              route === "characters" ? page([rick], 2, 3) : page([pilot], 2, 3)
            )
          )
      );
      const user = userEvent.setup();
      renderApp(`/${route}?page=2`);
      await screen.findByRole("heading", {
        name: route === "characters" ? "Rick Sanchez" : "Pilot",
      });

      await user.type(
        screen.getByRole("searchbox", { name: "Поиск по имени" }),
        "Unsaved draft"
      );
      await user.click(screen.getByRole("button", { name: "Сбросить" }));

      expect(
        screen.getByRole("searchbox", { name: "Поиск по имени" })
      ).toHaveValue("");
    }
  );

  it("closes stale character details when browser history changes the query", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input) => {
        const url = new URL(String(input));
        return jsonResponse(
          url.searchParams.get("page") === "2"
            ? page([morty], 2, 2)
            : page([rick], 1, 2)
        );
      })
    );
    function HistoryBack() {
      const navigate = useNavigate();
      return (
        <button type="button" onClick={() => navigate(-1)}>
          Назад по истории
        </button>
      );
    }
    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={["/characters", "/characters?page=2"]}
        initialIndex={1}
      >
        <App />
        <HistoryBack />
      </MemoryRouter>
    );
    await user.click(
      await screen.findByRole("button", { name: "Узнать больше: Morty Smith" })
    );
    expect(screen.getByRole("dialog", { name: "Morty Smith" })).toBeVisible();

    // Simulate a browser toolbar history action while the modal is open.
    fireEvent.click(screen.getByRole("button", { name: "Назад по истории" }));

    expect(
      await screen.findByRole("heading", { name: "Rick Sanchez" })
    ).toBeVisible();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Morty Smith" })
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("");
  });

  it("shows a useful not-found page for an unknown route", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>());
    renderApp("/missing-page");

    expect(await screen.findByText(/страница не найдена/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "К персонажам" })).toBeVisible();
  });
});
