import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/Admin/LoginPage";

import CategoryPage from "./pages/Admin/Category/CategoryPage";

import EntityPage from "./pages/Admin/Entity/EntityPage";

import AdminRoute from "./routes/AdminRoute";

import GamePage from "./pages/Game/GamePage";

import DashboardPage from "./pages/Admin/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />

        <Route path="/admin/login" element={<LoginPage />} />

        <Route
          path="/admin/category"
          element={
            <AdminRoute>
              <CategoryPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/entity"
          element={
            <AdminRoute>
              <EntityPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
