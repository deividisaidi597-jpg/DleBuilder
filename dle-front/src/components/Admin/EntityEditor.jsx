import { useState, useEffect } from "react";
import ArrayEditor from "./ArrayEditor";

export default function EntityEditor({ category, value, onChange, onSave }) {
  const [form, setForm] = useState(
    value || {
      name: "",
      attributes: {},
      modeData: {},
    },
  );

  useEffect(() => {
    setForm(
      value || {
        name: "",
        attributes: {},
        modeData: {},
      },
    );
  }, [value]);

  const update = (data) => {
    setForm(data);
    onChange?.(data);
  };

  return (
    <div
      style={{
        border: "1px solid #333",
        padding: 20,
        marginTop: 20,
      }}
    >
      <h2>{form._id ? "Editar" : "Nova Entidade"}</h2>

      {/* NAME */}
      <input
        placeholder="Nome"
        value={form.name || ""}
        onChange={(e) => update({ ...form, name: e.target.value })}
      />

      <hr />

      {/* ATTRIBUTES */}

      <hr />

      {/* MODE DATA */}
      {(category?.gameModes || [])
        .filter((m) => m.type !== "classic")
        .map((mode) => (
          <div key={mode.id}>
            <h4>{mode.label}</h4>

            <ArrayEditor
              value={form.modeData?.[mode.id] || []}
              onChange={(val) =>
                update({
                  ...form,
                  modeData: {
                    ...form.modeData,
                    [mode.id]: val,
                  },
                })
              }
            />
          </div>
        ))}

      <hr />

      <button onClick={() => onSave(form)}>Salvar</button>
    </div>
  );
}
