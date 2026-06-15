import ModeEditor from "./ModeEditor";
import TagInput from "./TagInput";

export default function DynamicForm({ category, form, setForm }) {
  if (!category) return null;

  const attributes = category.attributes ?? [];
  const gameModes = category.gameModes ?? [];
  const inputStyle = {
    width: "98%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#111827",
    color: "#fff",
    outline: "none",
  };
  const handleAttributeChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }));
  };

  return (
    <>
      {/* ATRIBUTOS */}
      {attributes.map((attr) => (
        <div key={attr.key} style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            {attr.label}
          </label>

          {/* STRING */}
          {attr.dataType === "string" && (
            <input
              value={form.attributes?.[attr.key] || ""}
              onChange={(e) => handleAttributeChange(attr.key, e.target.value)}
              style={inputStyle}
            />
          )}

          {/* NUMBER */}
          {attr.dataType === "number" && (
            <input
              type="number"
              value={form.attributes?.[attr.key] ?? ""}
              onChange={(e) =>
                handleAttributeChange(
                  attr.key,
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              style={inputStyle}
            />
          )}

          {/* ARRAY */}
          {attr.dataType === "array" && (
            <TagInput
              value={form.attributes?.[attr.key] || []}
              onChange={(val) => handleAttributeChange(attr.key, val)}
            />
          )}
        </div>
      ))}

      <hr
        style={{
          margin: "24px 0",
          borderColor: "#334155",
        }}
      />

      <h2
        style={{
          color: "#cbd5e1",
          marginBottom: 16,
        }}
      >
        Modos
      </h2>

      {gameModes
        .filter((m) => m.type !== "classic")
        .map((mode) => (
          <ModeEditor
            key={mode.id}
            mode={mode}
            value={form.modeData?.[mode.id] || []}
            onChange={(items) =>
              setForm((prev) => ({
                ...prev,
                modeData: {
                  ...prev.modeData,
                  [mode.id]: items,
                },
              }))
            }
          />
        ))}
    </>
  );
}
