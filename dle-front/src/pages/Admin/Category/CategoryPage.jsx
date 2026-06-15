import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../../services/category.service";
import AdminNavbar from "../../../components/Admin/AdminNavbar";
import { updateCategory } from "../../../services/category.service";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    displayName: "",
    backgroundImage: "",
    attributes: [],
    gameModes: [],
    classicHints: [],
  });

  const [editingId, setEditingId] = useState(null);

  const buttonBase = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  };

  const addBtn = {
    ...buttonBase,
    background: "#22c55e",
    color: "#0b1220",
  };

  const addBtnHover = {
    background: "#16a34a",
  };

  const deleteBtn = {
    ...buttonBase,
    background: "#ef4444",
    color: "#fff",
  };

  const deleteBtnHover = {
    background: "#dc2626",
  };

  const isFormValid = () => {
    if (!form.name.trim() || !form.displayName.trim()) return false;

    const attributesValid = form.attributes.every(
      (a) => a.key?.trim() && a.label?.trim(),
    );

    const modesValid = form.gameModes.every(
      (m) => m.id?.trim() && m.label?.trim(),
    );

    const hintsValid = form.classicHints.every(
      (h) =>
        h.modeId?.trim() &&
        h.attempts !== "" &&
        h.attempts !== null &&
        !isNaN(h.attempts),
    );

    return attributesValid && modesValid && hintsValid;
  };

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleCreate() {
    const invalidAttributes = form.attributes.some(
      (a) => !a.key.trim() || !a.label.trim(),
    );

    if (invalidAttributes) {
      return alert("Preencha todos os atributos corretamente");
    }

    const invalidModes = form.gameModes.some(
      (m) => !m.id.trim() || !m.label.trim(),
    );

    if (invalidModes) {
      return alert("Preencha todos os game modes corretamente");
    }

    const invalidHints = form.classicHints.some(
      (h) => !h.modeId.trim() || h.attempts === "" || h.attempts === null,
    );

    if (invalidHints) {
      return alert("Preencha todos os hints corretamente");
    }

    if (editingId) {
      await updateCategory(editingId, form);
    } else {
      await createCategory(form);
    }

    setForm({
      name: "",
      displayName: "",
      backgroundImage: "",
      attributes: [],
      gameModes: [],
      classicHints: [],
    });

    setEditingId(null);
    load();
  }

  async function handleDelete(id) {
    await deleteCategory(id);
    load();
  }

  function addAttribute() {
    setForm((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          key: "",
          label: "",
          dataType: "string",
          comparison: "exact",
        },
      ],
    }));
  }

  function updateAttribute(index, field, value) {
    const copy = [...form.attributes];
    copy[index][field] = value;
    if (field === "dataType") {
      const comparisonMap = {
        string: "exact",
        number: "number",
        array: "array",
      };

      copy[index].comparison = comparisonMap[value];
    }
    setForm({ ...form, attributes: copy });
  }

  function addMode() {
    setForm((prev) => ({
      ...prev,
      gameModes: [
        ...prev.gameModes,
        {
          id: "",
          label: "",
          type: "text",
        },
      ],
    }));
  }

  function updateMode(index, field, value) {
    const copy = [...form.gameModes];
    copy[index][field] = value;
    setForm({ ...form, gameModes: copy });
  }

  function addHint() {
    setForm((prev) => ({
      ...prev,
      classicHints: [
        ...prev.classicHints,
        {
          modeId: "",
          attempts: 0,
        },
      ],
    }));
  }

  function updateHint(index, field, value) {
    const copy = [...form.classicHints];
    copy[index][field] = value;
    setForm({ ...form, classicHints: copy });
  }

  function handleEdit(category) {
    setForm({
      name: category.name,
      displayName: category.displayName,
      backgroundImage: category.backgroundImage || "",
      attributes: category.attributes || [],
      gameModes: category.gameModes || [],
      classicHints: category.classicHints || [],
    });

    setEditingId(category._id);
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#0b1220",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <AdminNavbar />

      <h1>📦 Categorias</h1>

      {/* FORM */}
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          border: "1px solid #1f2937",
          borderRadius: 10,
          background: "#0f172a",
        }}
      >
        <h3>Categoria</h3>

        <input
          placeholder="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#111827",
            color: "#fff",
          }}
        />

        <input
          placeholder="displayName"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#111827",
            color: "#fff",
          }}
        />
        <input
          placeholder="URL da imagem de fundo"
          value={form.backgroundImage}
          onChange={(e) =>
            setForm({
              ...form,
              backgroundImage: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#111827",
            color: "#fff",
          }}
        />
        {/* ATTRIBUTES */}
        <div style={{ marginBottom: 20 }}>
          <h3>Atributos</h3>
          <button
            onClick={addAttribute}
            style={addBtn}
            onMouseEnter={(e) => {
              e.target.style.background = addBtnHover.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = addBtn.background;
            }}
          >
            + Adicionar
          </button>

          {form.attributes.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                placeholder="key"
                value={a.key}
                onChange={(e) => updateAttribute(i, "key", e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />

              <input
                placeholder="label"
                value={a.label}
                onChange={(e) => updateAttribute(i, "label", e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />
              <div style={{ position: "relative" }}>
                <select
                  value={a.dataType}
                  onChange={(e) =>
                    updateAttribute(i, "dataType", e.target.value)
                  }
                  style={{
                    padding: "8px 32px 8px 12px",
                    borderRadius: 8,
                    border: "1px solid #334155",
                    background: "#111827",
                    color: "#fff",
                    cursor: "pointer",
                    minWidth: 120,
                    appearance: "none",
                  }}
                >
                  <option value="string">Classic</option>
                  <option value="number">Número</option>
                  <option value="array">Lista</option>
                </select>

                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>
              <button
                onClick={() => {
                  const copy = [...form.attributes];
                  copy.splice(i, 1);
                  setForm({ ...form, attributes: copy });
                }}
                style={deleteBtn}
                onMouseEnter={(e) => {
                  e.target.style.background = deleteBtnHover.background;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = deleteBtn.background;
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* MODES */}
        <div style={{ marginBottom: 20 }}>
          <h3>Game Modes</h3>
          <button
            onClick={addMode}
            style={addBtn}
            onMouseEnter={(e) => {
              e.target.style.background = addBtnHover.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = addBtn.background;
            }}
          >
            + Mode
          </button>

          {form.gameModes.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                placeholder="id"
                value={m.id}
                onChange={(e) => updateMode(i, "id", e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />

              <input
                placeholder="label"
                value={m.label}
                onChange={(e) => updateMode(i, "label", e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />
              <div style={{ position: "relative" }}>
                <select
                  value={m.type}
                  onChange={(e) => updateMode(i, "type", e.target.value)}
                  style={{
                    padding: "8px 32px 8px 12px",
                    borderRadius: 8,
                    border: "1px solid #334155",
                    background: "#111827",
                    color: "#fff",
                    cursor: "pointer",
                    minWidth: 120,
                    appearance: "none",
                  }}
                >
                  <option value="classic">Clássico</option>
                  <option value="image">Imagem</option>
                  <option value="text">Texto</option>
                  <option value="emoji">Emoji</option>
                  <option value="audio">Áudio</option>
                </select>

                <span
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none",
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>
              <button
                onClick={() => {
                  const copy = [...form.gameModes];
                  copy.splice(i, 1);
                  setForm({ ...form, gameModes: copy });
                }}
                style={deleteBtn}
                onMouseEnter={(e) => {
                  e.target.style.background = deleteBtnHover.background;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = deleteBtn.background;
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* HINTS */}
        <div style={{ marginBottom: 20 }}>
          <h3>Classic Hints</h3>
          <button
            onClick={addHint}
            style={addBtn}
            onMouseEnter={(e) => {
              e.target.style.background = addBtnHover.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = addBtn.background;
            }}
          >
            + Adicionar
          </button>

          {form.classicHints.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <input
                placeholder="modeId"
                value={h.modeId}
                onChange={(e) => updateHint(i, "modeId", e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />

              <input
                placeholder="attempts"
                type="number"
                value={h.attempts}
                onChange={(e) =>
                  updateHint(i, "attempts", Number(e.target.value))
                }
                style={{
                  width: 120,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #334155",
                  background: "#111827",
                  color: "#fff",
                }}
              />
              <button
                onClick={() => {
                  const copy = [...form.classicHints];
                  copy.splice(i, 1);
                  setForm({ ...form, classicHints: copy });
                }}
                style={deleteBtn}
                onMouseEnter={(e) => {
                  e.target.style.background = deleteBtnHover.background;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = deleteBtn.background;
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreate}
          disabled={!form.name.trim() || !form.displayName.trim()}
          style={{
            ...addBtn,
            opacity: isFormValid() ? 1 : 0.4,
            cursor: isFormValid() ? "pointer" : "not-allowed",
            filter: isFormValid() ? "none" : "grayscale(0.5)",
          }}
        >
          {editingId ? "Atualizar Category" : "Criar Category"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                displayName: "",
                backgroundImage: "",
                attributes: [],
                gameModes: [],
                classicHints: [],
              });
            }}
            style={{
              marginLeft: 10,
              padding: "10px 14px",
              background: "#64748b",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Cancelar edição
          </button>
        )}
      </div>
      {/* LIST */}
      <h2 style={{ marginTop: 20 }}>📚 Lista de categorias</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[...categories]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((c) => (
            <div
              key={c._id}
              style={{
                border: "1px solid #1f2937",
                padding: 14,
                borderRadius: 10,
                background: "#0f172a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* INFO */}
              <div>
                <strong style={{ fontSize: 15 }}>{c.displayName}</strong>

                <p
                  style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: 13,
                  }}
                >
                  {c.name}
                </p>
              </div>

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    padding: "6px 10px",
                    background: "#334155",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(c._id)}
                  style={{
                    padding: "6px 10px",
                    background: "#ef4444",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
