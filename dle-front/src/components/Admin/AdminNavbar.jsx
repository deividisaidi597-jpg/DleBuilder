import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 10,
        borderBottom: "1px solid #333",
        marginBottom: 20,
      }}
    >
      <button onClick={() => navigate("/")}>🏠 Home</button>
      <button onClick={() => navigate(-1)}>⬅ Voltar</button>
      <button onClick={logout}>🚪 Sair</button>
    </div>
  );
}
