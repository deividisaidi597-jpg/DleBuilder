import { useState } from "react";

import HomePage from "./HomePage";
import ModeSelectPage from "./ModeSelectPage";
import PlayPage from "./PlayPage";

export default function GamePage() {
  const [category, setCategory] = useState(null);

  const [mode, setMode] = useState(null);

  if (!category) {
    return <HomePage onSelect={setCategory} />;
  }

  return (
    <div>
      <ModeSelectPage
        category={category}
        onSelect={setMode}
        selectedMode={mode}
      />

      {mode && (
        <PlayPage
          key={`${category._id}_${mode.id}`}
          category={category}
          mode={mode}
        />
      )}
    </div>
  );
}
