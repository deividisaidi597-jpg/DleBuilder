import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../services/category.service";

export default function HomePage({ onSelect }) {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f0f0f",
          color: "#fff",
        }}
      >
        <h2>Carregando categorias{dots}</h2>
        <p>Preparando o jogo 🎮</p>
      </div>
    );
  }
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f0f",
        color: "white",
        padding: 20,
      }}
    >
      {/* PERSONAGEM */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          alt="personagem"
          style={{
            width: 120,
            filter: "drop-shadow(0px 0px 10px #00ffcc)",
          }}
        />

        <h1>Escolha sua categoria</h1>

        <p style={{ opacity: 0.7 }}>
          O jogo adapta o desafio ao universo escolhido
        </p>
      </div>

      {/* 🔐 BOTÃO LOGIN ADMIN */}
      <button
        onClick={() => navigate("/admin/login")}
        style={{
          marginBottom: 20,
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #555",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        🔐 Login Admin
      </button>

      {/* CATEGORIAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 15,
          width: "100%",
          maxWidth: 700,
        }}
      >
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onSelect(category)}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#1a1a1a",
              border: "1px solid #333",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <h3>{category.displayName}</h3>
            <p style={{ fontSize: 12, opacity: 0.6 }}>
              {category.gameModes?.length || 0} modos
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
