import { useEffect, useState } from "react";

import { getEntities, deleteEntity } from "../../../services/entity.service";

export default function EntityListPage() {
  const [entities, setEntities] = useState([]);

  async function load() {
    const data = await getEntities();

    setEntities(data);
  }

  useEffect(() => {
    async function loadEntities() {
      const data = await getEntities();
      setEntities(data);
    }

    loadEntities();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Excluir?")) {
      return;
    }

    await deleteEntity(id);

    load();
  }

  return (
    <div>
      <h1>Entidades</h1>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {entities.map((entity) => (
            <tr key={entity._id}>
              <td>{entity.name}</td>

              <td>{entity.categoryId}</td>

              <td>
                <button>Editar</button>

                <button onClick={() => handleDelete(entity._id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
