import { Link } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";

export default function DashboardPage() {
  return (
    <div style={styles.page}>
      <AdminNavbar />

      <div style={styles.container}>
        <h1 style={styles.title}>🧩 Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Gerencie categorias e entidades do sistema
        </p>

        <div style={styles.grid}>
          <Link to="/admin/category" style={styles.card}>
            <div style={styles.icon}>📁</div>
            <h2 style={styles.cardTitle}>Categories</h2>
            <p style={styles.cardText}>
              Crie e configure atributos e modos do jogo
            </p>
          </Link>

          <Link to="/admin/entity" style={styles.card}>
            <div style={styles.icon}>🎮</div>
            <h2 style={styles.cardTitle}>Entities</h2>
            <p style={styles.cardText}>
              Cadastre personagens, itens e dados do jogo
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "#e5e7eb",
  },

  container: {
    padding: 30,
    maxWidth: 900,
    margin: "0 auto",
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 6,
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: 30,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#111827",
    padding: 20,
    borderRadius: 14,
    textDecoration: "none",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    transition: "0.2s",
  },

  icon: {
    fontSize: 30,
    marginBottom: 10,
  },

  cardTitle: {
    margin: "5px 0",
    fontSize: 18,
  },

  cardText: {
    fontSize: 13,
    color: "#94a3b8",
  },
};
