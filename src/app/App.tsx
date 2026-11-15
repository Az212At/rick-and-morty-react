import { Navigate, Route, Routes } from "react-router-dom";
import CharactersPage from "@/pages/characters/ui/CharactersPage";
import EpisodesPage from "@/pages/episodes/ui/EpisodesPage";
import NotFoundPage from "@/pages/not-found/ui/NotFoundPage";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/characters" replace />} />
        <Route path="characters" element={<CharactersPage />} />
        <Route path="episodes" element={<EpisodesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
