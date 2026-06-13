import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, RequirePermission } from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import PegawaiListPage from "./pages/PegawaiListPage";
import PegawaiFormPage from "./pages/PegawaiFormPage";
import PegawaiDetailPage from "./pages/PegawaiDetailPage";
import ProfilePage from "./pages/ProfilePage";
import ForbiddenPage from "./pages/ForbiddenPage";
import NotFoundPage from "./pages/NotFoundPage";
import ToastContainer from "./components/ToastContainer";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/pegawai" replace />} />

            <Route
              path="/pegawai"
              element={
                <RequirePermission permission="pegawai:read">
                  <PegawaiListPage />
                </RequirePermission>
              }
            />
            <Route
              path="/pegawai/baru"
              element={
                <RequirePermission permission="pegawai:create">
                  <PegawaiFormPage />
                </RequirePermission>
              }
            />
            <Route
              path="/pegawai/:id"
              element={
                <RequirePermission permission="pegawai:read">
                  <PegawaiDetailPage />
                </RequirePermission>
              }
            />
            <Route
              path="/pegawai/:id/edit"
              element={
                <RequirePermission permission="pegawai:update">
                  <PegawaiFormPage />
                </RequirePermission>
              }
            />

            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/forbidden" element={<ForbiddenPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
