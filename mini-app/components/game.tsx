"use client";

import { useEffect, useRef, useState } from "react";

const GRAVITY = 0.6;
const JUMP_VELOCITY = -12;
const OBSTACLE_INTERVAL = 2000; // ms
const SPEED_INCREMENT_INTERVAL = 10000; // ms
const INITIAL_SPEED = 5;

export default function Game({
  onGameOver,
}: {
  onGameOver: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const playerRef = useRef({
    x: 50,
    y: 0,
    vy: 0,
    width: 40,
    height: 60,
    onGround: false,
  });
  const obstaclesRef = useRef<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  // Handle input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") jump();
    };
    const handleTouch = () => jump();
    window.addEventListener("keydown", handleKey);
    window.addEventListener("touchstart", handleTouch);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  const jump = () => {
    const p = playerRef.current;
    if (p.onGround) {
      p.vy = JUMP_VELOCITY;
      p.onGround = false;
    }
  };

  // Game loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();
    let obstacleTimer = 0;
    let speedTimer = 0;

    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Update player
      const p = playerRef.current;
      p.vy += GRAVITY;
      p.y += p.vy;
      if (p.y + p.height >= 300) {
        p.y = 300 - p.height;
        p.vy = 0;
        p.onGround = true;
      }

      // Update obstacles
      obstacleTimer += delta;
      if (obstacleTimer > OBSTACLE_INTERVAL) {
        obstacleTimer = 0;
        const height = 40 + Math.random() * 60;
        obstaclesRef.current.push({
          x: 800,
          y: 300 - height,
          width: 30 + Math.random() * 20,
          height,
        });
      }

      // Move obstacles
      obstaclesRef.current = obstaclesRef.current
        .map((o) => ({ ...o, x: o.x - speed }))
        .filter((o) => o.x + o.width > 0);

      // Collision detection
      for (const o of obstaclesRef.current) {
        if (
          p.x < o.x + o.width &&
          p.x + p.width > o.x &&
          p.y < o.y + o.height &&
          p.y + p.height > o.y
        ) {
          onGameOver(Math.floor(score));
          return;
        }
      }

      // Update score
      setScore((s) => {
        const newScore = s + 1;
        document.getElementById('score-hud')?.innerText = `${newScore}m`;
        return newScore;
      });

      // Increase speed
      speedTimer += delta;
      if (speedTimer > SPEED_INCREMENT_INTERVAL) {
        speedTimer = 0;
        setSpeed((s) => s + 0.5);
      }

      // Render
      ctx.clearRect(0, 0, 800, 400);
      ctx.fillStyle = "#333333";
      ctx.fillRect(0, 0, 800, 400);
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(0, 380, 800, 20);

      // Draw player
      ctx.save();
      ctx.translate(p.x + p.width, 0);
      ctx.scale(-1, 1);
      ctx.font = "48px serif";
      ctx.fillText("🏃", 0, p.y + p.height);
      ctx.restore();

      // Draw obstacles
      obstaclesRef.current.forEach((o) => {
        ctx.font = "48px serif";
        ctx.fillText("📚", o.x, o.y + o.height);
      });

      ctx.fillStyle = "#ffd700";
      ctx.font = "30px serif";
      ctx.fillText(`Distance: ${Math.floor(score)} m`, 650, 30);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, [onGameOver]);

  return <canvas ref={canvasRef} width={800} height={400} className="border border-primary" />;
}
