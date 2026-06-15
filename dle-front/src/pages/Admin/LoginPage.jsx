import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const data = await login({ email, password });

      localStorage.setItem("token", data.token);

      navigate("/admin");
    } catch {
      alert("Email ou senha inválidos");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
        color: "#fff",
        gap: 40,
      }}
    >
      {/* PERSONAGEM */}
      <div style={{ textAlign: "center" }}>
        <img
          onClick={() => navigate("/")}
          src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
          width={180}
          style={{ filter: "drop-shadow(0 0 10px #000)", cursor: "pointer" }}
        />
        <h2>Admin Access</h2>
      </div>

      {/* FORM */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "#222",
          padding: 20,
          borderRadius: 10,
          minWidth: 250,
        }}
      >
        <h3>Login</h3>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Entrar</button>
      </div>
    </div>
  );
}
