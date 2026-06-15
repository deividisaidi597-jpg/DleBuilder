import { useEffect, useState } from "react";

import { searchEntities } from "../../services/game.service";

export default function EntityAutocomplete({
  categoryId,
  guessedNames = [],
  onSelect,
}) {
  const [query, setQuery] = useState("");

  const [entities, setEntities] = useState([]);

  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;

    const timeout = setTimeout(async () => {
      try {
        const data = await searchEntities(categoryId, query);

        const filtered = data.filter(
          (entity) => !guessedNames.includes(entity.name),
        );

        setEntities(filtered);
      } catch (error) {
        console.error(error);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, categoryId, guessedNames]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <input
        style={{ width: "300px" }}
        placeholder="Digite..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.trim() && entities.length > 0 && (
        <div style={styles.dropdown}>
          {entities.map((entity) => {
            const splash = entity.modeData?.splash?.[0]?.image;

            return (
              <div
                key={entity._id}
                style={{
                  ...styles.option,
                  ...(hovered === entity._id && styles.optionHover),
                }}
                onMouseEnter={() => setHovered(entity._id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  onSelect(entity);
                  setQuery("");
                }}
              >
                {splash && (
                  <img
                    src={splash}
                    alt={entity.name}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 6,
                      objectFit: "cover",
                    }}
                  />
                )}

                <span>{entity.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
const styles = {
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "305px",

    maxHeight: "300px",
    overflowY: "auto",
    overflowX: "hidden",

    background: "#111827",
    border: "1px solid #374151",
    borderRadius: "8px",

    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,.3)",
  },

  option: {
    cursor: "pointer",
    padding: "10px",
    borderBottom: "1px solid #333",

    display: "flex",
    alignItems: "center",
    gap: 10,

    transition: "all 0.2s ease",
  },

  optionHover: {
    background: "#1f2937",
    transform: "translateX(4px)",
    borderLeft: "3px solid #60a5fa",
  },
};
