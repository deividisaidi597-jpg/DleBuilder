import { useEffect, useState } from "react";

export default function GuessTable({ history, category }) {
  const [visibleCells, setVisibleCells] = useState(0);

  useEffect(() => {
    if (!history.length) return;

    setVisibleCells(0);

    const total = category.attributes.length + 1; // nome + atributos

    let current = 0;

    const interval = setInterval(() => {
      current++;
      setVisibleCells(current);

      if (current >= total) {
        clearInterval(interval);
      }
    }, 500); // velocidade da animação

    return () => clearInterval(interval);
  }, [history.length, category.attributes.length]);

  if (!history.length) {
    return null;
  }

  const getColor = (status) => {
    switch (status) {
      case "correct":
        return "#2ecc71";

      case "partial":
        return "#f1c40f";

      case "higher":
      case "lower":
        return "#3498db";

      default:
        return "#e74c3c";
    }
  };

  return (
    <table
      style={{
        width: "100%",
        marginTop: "20px",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>{category.name === "lol" ? "Campeão" : "Nome"}</th>

          {category.attributes.map((attr) => (
            <th key={attr.key}>{attr.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {history.map((attempt, index) => (
          <tr key={`${attempt.guessedEntity.id}-${index}`}>
            <td
              style={{
                background: attempt.correct ? "#2ecc71" : "#333",
                color: "white",
                padding: "10px",
                opacity: index === 0 ? (visibleCells >= 1 ? 1 : 0) : 1,
                transition: "opacity .2s",
              }}
            >
              {attempt.guessedEntity?.name ?? "-"}
            </td>

            {category.attributes.map((attr, attrIndex) => {
              const value = attempt.guessedEntity.attributes?.[attr.key];

              return (
                <td
                  key={attr.key}
                  style={{
                    background: getColor(attempt.checks[attr.key]),
                    color: "white",
                    padding: "10px",
                    textAlign: "center",

                    opacity:
                      index === 0 ? (visibleCells >= attrIndex + 2 ? 1 : 0) : 1,

                    transition: "opacity .2s",
                  }}
                >
                  {Array.isArray(value) ? value.join(", ") : value}

                  {attempt.checks[attr.key] === "higher" && " ↑"}

                  {attempt.checks[attr.key] === "lower" && " ↓"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
