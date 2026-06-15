import { useEffect, useState } from "react";

import DynamicForm from "../../../components/Form/DynamicForm";
import AdminNavbar from "../../../components/Admin/AdminNavbar";

import { getCategories, getCategory } from "../../../services/category.service";

import {
  createEntity,
  getEntities,
  updateEntity,
  deleteEntity,
  getEntity,
} from "../../../services/entity.service";

export default function EntityPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [category, setCategory] = useState(null);
  const [entities, setEntities] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    attributes: {},
    modeData: {},
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;

    async function load() {
      const [cat, ents] = await Promise.all([
        getCategory(selectedCategoryId),
        getEntities(selectedCategoryId),
      ]);

      setCategory(cat);
      setEntities(ents);

      setForm((p) => ({ ...p, categoryId: selectedCategoryId }));
    }

    load();
  }, [selectedCategoryId]);

  const reset = () => {
    setForm({
      categoryId: selectedCategoryId,
      name: "",
      attributes: {},
      modeData: {},
    });
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        return alert("Nome obrigatório");
      }

      if (editingId) {
        await updateEntity(editingId, form);
      } else {
        await createEntity(form);
      }

      setEntities(await getEntities(selectedCategoryId));

      reset();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Erro ao salvar entidade");
    }
  };

  const handleEdit = async (e) => {
    const full = await getEntity(e._id);

    setForm({
      categoryId: full.categoryId,
      name: full.name,
      attributes: full.attributes || {},
      modeData: full.modeData || {},
    });

    setEditingId(e._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Excluir entidade?")) return;

    await deleteEntity(id);
    setEntities(await getEntities(selectedCategoryId));
  };

  return (
    <div style={styles.page}>
      <AdminNavbar />

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>🧩 Entity Builder</h1>

        <select
          style={styles.select}
          value={selectedCategoryId}
          onChange={(e) => {
            setSelectedCategoryId(e.target.value);
            reset();
          }}
        >
          <option value="">Escolha uma categoria</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.displayName}
            </option>
          ))}
        </select>
      </div>

      {!category ? (
        <div style={styles.empty}>
          <h2>Selecione uma categoria para começar</h2>
        </div>
      ) : (
        <>
          {/* ================= FORM ================= */}
          <div style={styles.cardForm}>
            <div style={styles.cardHeader}>
              <h2>{editingId ? "✏️ Editar Entidade" : "➕ Nova Entidade"}</h2>
              <span style={styles.badge}>{category.displayName}</span>
            </div>

            <div style={styles.field}>
              <h3 style={styles.sectionTitle}>Nome</h3>
              <input
                style={styles.input}
                placeholder="Digite a que.."
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Atributos</h3>

              <div style={styles.box}>
                <DynamicForm
                  key={category._id}
                  category={category}
                  form={form}
                  setForm={setForm}
                />
              </div>
            </div>

            <div style={styles.actions}>
              <button style={styles.saveBtn} onClick={handleSave}>
                {editingId ? "Atualizar" : "Salvar"}
              </button>

              {editingId && (
                <button style={styles.cancelBtn} onClick={reset}>
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* ================= LISTA AGORA EMBAIXO ================= */}
          <div style={styles.cardList}>
            <h2 style={styles.sectionTitle}>Entidades cadastradas</h2>

            {entities.length === 0 ? (
              <p style={styles.muted}>Nenhuma entidade ainda</p>
            ) : (
              <div style={styles.list}>
                {entities.map((e) => (
                  <div key={e._id} style={styles.entityCard}>
                    <div>
                      <b>{e.name}</b>
                      <p style={styles.smallText}>
                        {Object.keys(e.attributes || {}).length} atributos
                      </p>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(e)}
                      >
                        Editar
                      </button>
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(e._id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
const styles = {
  page: {
    padding: 24,
    background: "#0b1220",
    minHeight: "100vh",
    color: "#e5e7eb",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
  },

  select: {
    padding: 10,
    borderRadius: 10,
    background: "#111827",
    color: "#fff",
    border: "1px solid #334155",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  cardForm: {
    background: "#111827",
    padding: 20,
    borderRadius: 14,
    border: "1px solid #1f2937",
  },

  cardList: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 14,
    border: "1px solid #1f2937",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  badge: {
    fontSize: 12,
    background: "#1f2937",
    padding: "4px 10px",
    borderRadius: 999,
    color: "#93c5fd",
  },

  field: {
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    color: "#94a3b8",
  },

  input: {
    width: "95%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#fff",
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#cbd5e1",
  },

  box: {
    padding: 12,
    borderRadius: 10,
    background: "#0b1220",
    border: "1px solid #334155",
  },

  actions: {
    marginTop: 20,
    display: "flex",
    gap: 10,
  },

  saveBtn: {
    padding: "10px 14px",
    background: "#22c55e",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    color: "#000",
    fontWeight: 600,
  },

  cancelBtn: {
    padding: "10px 14px",
    background: "#ef4444",
    border: "none",
    borderRadius: 10,
    color: "#fff",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  entityCard: {
    background: "#111827",
    padding: 14,
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid #1f2937",
  },

  cardActions: {
    display: "flex",
    gap: 8,
  },

  muted: {
    color: "#64748b",
  },

  smallText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#94a3b8",
  },
};
