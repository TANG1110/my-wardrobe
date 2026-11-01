import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import WardrobePage from '@/pages/WardrobePage/WardrobePage';
import TryOnPage from '@/pages/TryOnPage/TryOnPage';
import OutfitLogPage from '@/pages/OutfitLogPage/OutfitLogPage';
import AddClothingPage from '@/pages/AddClothingPage/AddClothingPage';
import BodySettingsPage from '@/pages/BodySettingsPage/BodySettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/wardrobe" replace />} />
        <Route path="wardrobe" element={<WardrobePage />} />
        <Route path="try-on" element={<TryOnPage />} />
        <Route path="outfit-log" element={<OutfitLogPage />} />
        <Route path="add-clothing" element={<AddClothingPage />} />
        <Route path="body-settings" element={<BodySettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
