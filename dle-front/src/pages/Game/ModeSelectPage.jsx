import { useEffect, useState } from "react";
import { getModes } from "../../services/game.service";

export default function ModeSelectPage({ category, onSelect }) {
  const [modes, setModes] = useState([]);

  useEffect(() => {
    getModes(category._id).then((data) => {
      setModes(data.modes);
    });
  }, [category]);

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => window.location.reload()}>
          ← Voltar
        </button>

        <h1 style={styles.title}>{category.displayName}</h1>
      </div>

      {/* MODOS */}
      <div style={styles.grid}>
        {modes.map((mode) => (
          <div key={mode.id} style={styles.card} onClick={() => onSelect(mode)}>
            <h2 style={styles.cardTitle}>{mode.label}</h2>
            <p style={styles.cardText}>
              Clique para jogar no modo {mode.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#0b1220",
    color: "#fff",
    padding: 20,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },

  backBtn: {
    padding: "8px 12px",
    background: "#1f2937",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
    marginTop: 20,
  },

  card: {
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 12,
    padding: 20,
    cursor: "pointer",
    transition: "0.2s",
  },

  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
  },

  cardText: {
    fontSize: 12,
    color: "#94a3b8",
  },
};
