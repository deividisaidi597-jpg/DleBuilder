import { useState, useRef } from "react";
import { uploadAudio } from "../../services/upload.service";

export default function ModeEditor({ mode, value = [], onChange }) {
  const [temp, setTemp] = useState({});
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const items = value;

  const isValid = () => {
    if (mode.type === "text") return temp.text?.trim();
    if (mode.type === "emoji") return temp.items?.trim();
    if (mode.type === "audio") {
      return temp.title?.trim() && temp.audio?.trim();
    }
    if (mode.type === "image") {
      return temp.title?.trim() && temp.image?.trim();
    }

    return false;
  };

  const add = () => {
    if (!isValid()) return;

    const updated = [...items, temp];
    onChange(updated);
    setTemp({
      title: "",
      audio: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const remove = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);
      const title = temp.title?.trim() || file.name.replace(/\.[^/.]+$/, "");

      const data = await uploadAudio(file, title);

      setTemp((prev) => ({
        ...prev,
        title: prev.title || title,
        audio: data.audio,
      }));
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar áudio");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.box}>
      <h3 style={styles.title}>{mode.label}</h3>

      {/* INPUT AREA */}
      <div style={styles.inputRow}>
        {mode.type === "text" && (
          <input
            placeholder={`Digite ${mode.type}...`}
            value={temp.text || ""}
            onChange={(e) => setTemp({ text: e.target.value })}
            style={styles.input}
          />
        )}

        {mode.type === "emoji" && (
          <input
            placeholder="🔥 ⚔️ 😀"
            value={temp.items || ""}
            onChange={(e) => setTemp({ items: e.target.value })}
            style={styles.input}
          />
        )}

        {mode.type === "image" && (
          <>
            <input
              placeholder="Título"
              value={temp.title || ""}
              onChange={(e) =>
                setTemp((p) => ({ ...p, title: e.target.value }))
              }
              style={styles.input}
            />

            <input
              placeholder="URL da imagem"
              value={temp.image || ""}
              onChange={(e) =>
                setTemp((p) => ({ ...p, image: e.target.value }))
              }
              style={styles.input}
            />
          </>
        )}

        {mode.type === "audio" && (
          <>
            <input
              placeholder="Título"
              value={temp.title || ""}
              onChange={(e) =>
                setTemp((p) => ({
                  ...p,
                  title: e.target.value,
                }))
              }
              style={styles.input}
            />

            <input
              placeholder="URL do áudio ou envie um arquivo 10mb"
              value={temp.audio || ""}
              onChange={(e) =>
                setTemp((p) => ({
                  ...p,
                  audio: e.target.value,
                }))
              }
              style={{
                ...styles.input,
                opacity: 0.7,
              }}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              disabled={uploading}
              onChange={handleAudioUpload}
            />
          </>
        )}

        <button
          onClick={add}
          disabled={!isValid()}
          style={{
            ...styles.addBtn,
            opacity: isValid() ? 1 : 0.4,
            cursor: isValid() ? "pointer" : "not-allowed",
          }}
        >
          + Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div style={styles.list}>
        {items.length === 0 && (
          <span style={styles.empty}>Nenhum item adicionado</span>
        )}

        {items.map((item, i) => (
          <div key={i} style={styles.item}>
            <div style={styles.itemContent}>
              {mode.type === "text" && item.text}
              {mode.type === "emoji" && item.items}
              {mode.type === "image" && (
                <div style={styles.imageItem}>
                  <b>{item.title}</b>

                  <img
                    src={item.image}
                    alt={item.title}
                    style={styles.previewImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />

                  {/*<small style={styles.urlText}> 
                    {item.image.length > 40
                      ? item.image.slice(0, 40) + "..."
                      : item.image}
                  </small>*/}
                </div>
              )}
              {mode.type === "audio" && (
                <div>
                  <b>{item.title}</b>

                  <audio
                    controls
                    src={
                      item.audio.startsWith("http")
                        ? item.audio
                        : `${import.meta.env.VITE_API_URL}${item.audio}`
                    }
                  />
                </div>
              )}
            </div>

            <button onClick={() => remove(i)} style={styles.remove}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  box: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    background: "#0b1220",
    border: "1px solid #334155",
  },

  title: {
    marginBottom: 12,
    fontSize: 14,
    color: "#cbd5e1",
    fontWeight: 600,
  },

  inputRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },

  input: {
    flex: 1,
    minWidth: 140,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#111827",
    color: "#fff",
    outline: "none",
  },

  addBtn: {
    padding: "10px 14px",
    background: "#22c55e",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    color: "#0b1220",
  },

  list: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#111827",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #1f2937",
  },

  itemContent: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  remove: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontSize: 18,
  },

  empty: {
    fontSize: 12,
    opacity: 0.6,
  },
  urlText: {
    opacity: 0.7,
    fontSize: 11,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  imageItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    maxWidth: "100%",
  },

  previewImage: {
    width: 120,
    height: 70,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #334155",
  },
};
