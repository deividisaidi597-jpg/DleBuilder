import { useEffect, useState, useCallback } from "react";

import { startGame, guess } from "../../services/game.service";

import EntityAutocomplete from "../../components/Game/EntityAutocomplete";

import GuessTable from "../../components/Game/GuessTable";

export default function PlayPage({ category, mode }) {
  const storageKey = `${category._id}_${mode.id}`;

  const savedGame = JSON.parse(localStorage.getItem(storageKey) || "{}");

  const [sessionId, setSessionId] = useState(savedGame.sessionId || "");

  const [challenge, setChallenge] = useState(savedGame.challenge || null);

  const [history, setHistory] = useState(savedGame.history || []);

  const [finished, setFinished] = useState(savedGame.finished || false);

  const [seconds, setSeconds] = useState(0);

  const progress = JSON.parse(
    localStorage.getItem(`category_progress_${category._id}`) || "{}",
  );

  const completedAll = category.gameModes.every(
    (gameMode) => progress[gameMode.id],
  );

  // ==================== LÓGICA DE SPLASH/ZOOM ====================
  const splashKey = `${category._id}_splash_wrong`;
  const [splashWrong, setSplashWrong] = useState(() => {
    return Number(localStorage.getItem(splashKey)) || 0;
  });
  const zoomLevel =
    mode.id === "splash"
      ? finished
        ? 1
        : Math.max(1, 7 - splashWrong * 0.4)
      : 1;
  useEffect(() => {
    localStorage.setItem(splashKey, splashWrong);
  }, [splashKey, splashWrong]);

  // ==================== LÓGICA DE EMOJI ====================
  const emojiKey = `${category._id}_emoji_wrong`;
  const [emojiWrong, setEmojiWrong] = useState(() => {
    return Number(localStorage.getItem(emojiKey)) || 0;
  });
  const rawEmoji = challenge?.items || "";
  const allEmojis = rawEmoji
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  const emojiConfig = category.classicHints?.find((h) => h.modeId === "emoji");
  const attemptsPerHint = emojiConfig?.attempts || 1;
  const revealedCount = Math.min(
    allEmojis.length,
    Math.floor(emojiWrong / attemptsPerHint) + 1,
  );

  useEffect(() => {
    localStorage.setItem(emojiKey, emojiWrong);
  }, [emojiKey, emojiWrong]);

  // ==================== LÓGICA DE ÁUDIO (QUOTE) ====================
  const audioKey = `${category._id}_audio_wrong`;

  const [audioWrong, setAudioWrong] = useState(() => {
    return Number(localStorage.getItem(audioKey)) || 0;
  });

  const audioConfig = category.classicHints?.find((h) => h.modeId === "quote");

  const attemptsPerAudio = audioConfig?.attempts || 1;

  const audioUnlocked = audioWrong >= attemptsPerAudio;
  const remainingAudioAttempts = Math.max(0, attemptsPerAudio - audioWrong);

  useEffect(() => {
    if (sessionId) {
      return;
    }

    async function initializeGame() {
      try {
        let playerId = localStorage.getItem("playerId");

        if (!playerId) {
          playerId = crypto.randomUUID();

          localStorage.setItem("playerId", playerId);
        }

        const data = await startGame({
          playerId,
          categoryId: category._id,
          modeId: mode.id,
        });
        setSessionId(data.sessionId);

        setChallenge(data.challenge);
      } catch (error) {
        console.error(error);

        alert(error?.response?.data?.message || "Erro ao iniciar partida");
      }
    }

    initializeGame();
  }, [category._id, mode.id, sessionId]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        sessionId,
        challenge,
        history,
        finished,
      }),
    );
  }, [storageKey, sessionId, challenge, history, finished]);

  const resetCategory = useCallback(() => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(category._id)) {
        localStorage.removeItem(key);
      }
    });

    localStorage.removeItem(`category_progress_${category._id}`);
    localStorage.removeItem(`category_reset_${category._id}`);

    window.location.reload();
  }, [category._id]);

  useEffect(() => {
    if (!completedAll) return;

    const interval = setInterval(() => {
      const resetAt = Number(
        localStorage.getItem(`category_reset_${category._id}`),
      );

      if (!resetAt) {
        clearInterval(interval);
        return;
      }

      const remainingMs = resetAt - Date.now();

      if (remainingMs <= 0) {
        clearInterval(interval);

        resetCategory();

        return;
      }

      setSeconds(Math.ceil(remainingMs / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [completedAll, category._id, resetCategory]);

  useEffect(() => {
    localStorage.setItem(audioKey, audioWrong);
  }, [audioKey, audioWrong]);

  const handleGuess = async (entity) => {
    try {
      const response = await guess({
        sessionId,
        guess: entity.name,
      });

      setHistory((prev) => [response, ...prev]);

      if (!response.correct) {
        if (mode.id === "splash") {
          setSplashWrong((p) => p + 1);
        }

        if (mode.id === "emoji") {
          setEmojiWrong((p) => p + 1);
        }

        if (mode.id === "quote") {
          setAudioWrong((p) => p + 1);
        }
      }

      if (response.correct) {
        setFinished(true);

        const currentProgress = JSON.parse(
          localStorage.getItem(`category_progress_${category._id}`) || "{}",
        );

        currentProgress[mode.id] = true;

        localStorage.setItem(
          `category_progress_${category._id}`,
          JSON.stringify(currentProgress),
        );

        const updatedProgress = {
          ...currentProgress,
        };

        const allCompleted = category.gameModes.every(
          (m) => updatedProgress[m.id],
        );

        if (allCompleted) {
          localStorage.setItem(
            `category_reset_${category._id}`,
            (Date.now() + 20000).toString(),
          );
        }
      }
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Erro ao enviar tentativa");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        backgroundImage: `
    linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)),
    url(${category.backgroundImage})
  `,
        backgroundSize: "contain",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1
        style={{
          marginTop: 0,
          padding: 50,
          color: "#fff",
        }}
      >
        {mode.label}
      </h1>

      <div
        style={{
          marginBottom: "10px",
        }}
      ></div>

      {completedAll && (
        <div>
          <h2>Todos os modos concluídos!</h2>

          <h3>Novo desafio em {seconds}s</h3>
        </div>
      )}

      {/* TEXTO */}
      {challenge?.text && <h2>{challenge.text}</h2>}

      {/* AUDIO */}
      {mode.id === "quote" && challenge?.title && (
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {challenge.title}
        </h2>
      )}

      {mode.id === "quote" && challenge?.audio && (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {audioUnlocked ? (
            <audio
              controls
              src={
                challenge.audio.startsWith("http")
                  ? challenge.audio
                  : `${import.meta.env.VITE_API_URL}${challenge.audio}`
              }
            />
          ) : (
            <div>🔒 Áudio desbloqueia após {remainingAudioAttempts} erros</div>
          )}
        </div>
      )}

      {/* EMOJI */}
      {mode.id === "emoji" && allEmojis.length > 0 && (
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            fontSize: "32px",
          }}
        >
          {allEmojis.map((emoji, index) => (
            <span key={index}>{index < revealedCount ? emoji : "❌"}</span>
          ))}
        </h2>
      )}

      {/* IMAGEM */}
      {challenge?.image && mode.id === "splash" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              overflow: "hidden",
              borderRadius: "12px",
            }}
          >
            <img
              src={challenge.image}
              alt=""
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.4s ease",
                userSelect: "none",
              }}
            />
          </div>
        </div>
      )}

      {challenge?.image && mode.id === "ability" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <img
            src={challenge.image}
            alt=""
            style={{
              width: 220,
              height: 220,
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
        </div>
      )}

      {!finished && (
        <EntityAutocomplete
          categoryId={category._id}
          guessedNames={history
            .filter((h) => h.guessedEntity)
            .map((h) => h.guessedEntity.name)}
          onSelect={handleGuess}
        />
      )}

      <GuessTable history={history} category={category} />
    </div>
  );
}
