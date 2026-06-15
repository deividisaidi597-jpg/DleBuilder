import { useState } from "react";

export default function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");

  const addTags = () => {
    if (!input.trim()) return;

    const newTags = input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onChange([...value, ...newTags]);
    setInput("");
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* INPUT */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          placeholder={placeholder || "Digite e use vírgula ,"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTags()}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#111827",
            color: "#fff",
          }}
        />

        <button onClick={addTags}>Adicionar</button>
      </div>

      {/* CHIPS */}
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {value.map((tag, index) => (
          <div
            key={index}
            style={{
              padding: "5px 10px",
              background: "#1e293b",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {tag}
            <span
              style={{ cursor: "pointer", color: "#ef4444" }}
              onClick={() => removeTag(index)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
