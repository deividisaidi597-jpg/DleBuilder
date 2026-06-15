export default function GuessTable({ history, category }) {
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
              }}
            >
              {attempt.guessedEntity?.name ?? "-"}
            </td>

            {category.attributes.map((attr) => {
              const value = attempt.guessedEntity.attributes?.[attr.key];

              return (
                <td
                  key={attr.key}
                  style={{
                    background: getColor(attempt.checks[attr.key]),

                    color: "white",

                    padding: "10px",

                    textAlign: "center",
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
