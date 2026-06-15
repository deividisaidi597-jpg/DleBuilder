import { useState } from "react";

export default function ArrayEditor({ value = [], onChange }) {
  const [input, setInput] = useState("");

  const addItem = () => {
    if (!input.trim()) return;

    onChange([...value, input.trim()]);
    setInput("");
  };

  const removeItem = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* INPUT */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem}>+</button>
      </div>

      {/* CHIPS */}
      <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {value.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "5px 10px",
              background: "#333",
              color: "white",
              borderRadius: 8,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            {item}
            <span
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => removeItem(index)}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
