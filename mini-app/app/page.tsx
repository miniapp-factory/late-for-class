import { description, title } from "@/lib/metadata";
import { generateMetadata } from "@/lib/farcaster-embed";
import { useState } from "react";
import Game from "@/components/game";

export { generateMetadata };

export default function Home() {
  // NEVER write anything here, only use this page to import components
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  return (
    <main className="flex flex-col gap-3 place-items-center place-content-center px-4 grow relative">
      <span className="text-2xl font-bold">{title}</span>
      <span className="text-muted-foreground">{description}</span>

      {!isRunning && !gameOver && (
        <button
          onClick={() => setIsRunning(true)}
          className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-md animate-pulse hover:bg-primary/80 transition-colors"
        >
          Start Run
        </button>
      )}

      {isRunning && (
        <Game
          onGameOver={(score) => {
            setFinalScore(score);
            setIsRunning(false);
            setGameOver(true);
          }}
        />
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-4">You are Late!</h1>
          <p className="text-xl text-white mb-8">Distance: {finalScore} m</p>
          <button
            onClick={() => {
              setGameOver(false);
              setFinalScore(0);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition-colors"
          >
            Retake Subject
          </button>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 right-4 text-white font-mono text-lg">
        Distance: {isRunning ? <span id="score">0</span> : finalScore} m
      </div>
    </main>
  );
}
