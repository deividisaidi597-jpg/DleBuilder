export default function GuessHistory({ history }) {
  if (!history.length) {
    return null;
  }

  const columns = Object.keys(history[0]?.checks || {});

  const getStyle = (value) => {
    switch (value) {
      case "correct":
        return {
          background: "#22c55e",
          color: "#fff",
        };

      case "partial":
        return {
          background: "#eab308",
          color: "#000",
        };

      case "wrong":
        return {
          background: "#ef4444",
          color: "#fff",
        };

      case "higher":
      case "lower":
        return {
          background: "#3b82f6",
          color: "#fff",
        };

      default:
        return {};
    }
  };

  const getText = (value) => {
    if (value === "higher") return "⬆️";
    if (value === "lower") return "⬇️";

    return value;
  };

  return (
    <div style={{ marginTop: 20 }}>
      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr>
            <th>Nome</th>

            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {history.map((attempt, index) => (
            <tr key={index}>
              <td>{attempt.guessedEntity?.name}</td>

              {columns.map((column) => (
                <td key={column} style={getStyle(attempt.checks[column])}>
                  {getText(attempt.checks[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
