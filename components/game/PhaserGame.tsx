"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { OfficeScene } from "./scenes/OfficeScene";

export default function PhaserGame() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization
    if (gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 640,
      height: 480,
      backgroundColor: "#1a1a2e",
      scene: [OfficeScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);
    
    gameRef.current.events.once("ready", () => {
      setGameReady(true);
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="pixel-office">
      <div 
        ref={containerRef} 
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <style jsx>{`
        .pixel-office {
          width: 100%;
          height: 100%;
          background: #0f0f1a;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
