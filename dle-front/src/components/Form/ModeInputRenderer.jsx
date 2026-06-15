import { useState } from "react";

export default function ModeInputRenderer({ mode, value = [], onChange }) {
  const [temp, setTemp] = useState({});

  const add = () => {
    if (Object.keys(temp).length === 0) return;

    onChange([...value, temp]);
    setTemp({});
  };

  const remove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const renderInputs = () => {
    switch (mode.type) {
      case "text":
        return (
          <input
            placeholder="Digite..."
            value={temp.text || ""}
            onChange={(e) => setTemp({ text: e.target.value })}
          />
        );

      case "emoji":
        return (
          <input
            placeholder="😀🔥⚔️"
            value={temp.items || ""}
            onChange={(e) => setTemp({ items: e.target.value })}
          />
        );

      case "image":
        return (
          <>
            <input
              placeholder="Título"
              value={temp.title || ""}
              onChange={(e) =>
                setTemp((p) => ({ ...p, title: e.target.value }))
              }
            />

            <input
              placeholder="URL"
              value={temp.image || ""}
              onChange={(e) =>
                setTemp((p) => ({ ...p, image: e.target.value }))
              }
            />
          </>
        );

      default:
        return (
          <input
            placeholder="Valor"
            value={temp.value || ""}
            onChange={(e) => setTemp({ value: e.target.value })}
          />
        );
    }
  };

  return (
    <div style={box}>
      <h4>{mode.label}</h4>

      <div style={row}>
        {renderInputs()}

        <button onClick={add} style={addBtn}>
          +
        </button>
      </div>

      <div style={list}>
        {value.map((v, i) => (
          <div key={i} style={item}>
            <span>{v.text || v.items || v.title || v.value}</span>

            <button onClick={() => remove(i)} style={removeBtn}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const box = {
  marginBottom: 16,
  padding: 12,
  borderRadius: 10,
  background: "#0b1220",
  border: "1px solid #334155",
};

const row = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const list = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const item = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 10px",
  background: "#111827",
  borderRadius: 8,
};

const addBtn = {
  padding: "8px 10px",
  background: "#22c55e",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  color: "#ef4444",
  cursor: "pointer",
};
