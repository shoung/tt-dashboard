"use client";

import dynamic from "next/dynamic";

// Dynamic import for Phaser (client-side only)
const PhaserGame = dynamic(() => import("@/components/game/PhaserGame"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      background: "#0f0f1a", 
      borderRadius: "8px",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#a0a0b0",
      fontSize: "0.75rem",
    }}>
      Loading game...
    </div>
  ),
});

// Dynamic import for calendar (client-side only)
const TaskCalendar = dynamic(() => import("@/components/TaskCalendar"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      background: "#1e1e2e", 
      borderRadius: "12px", 
      padding: "40px",
      textAlign: "center",
      color: "#a0a0b0"
    }}>
      Loading calendar...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="dashboard">
      <header className="header">
        <h1>🤖 TT Agent Dashboard</h1>
        <p className="subtitle">我的狀態 & 定期任務</p>
      </header>

      <main className="main-content">
        <section className="left-panel">
          <div className="panel-header">
            <h2>🏢 我的辦公室</h2>
            <span className="status-indicator">🟢 Online</span>
          </div>
          <div className="game-container">
            <PhaserGame />
          </div>
          <div className="status-legend">
            <div className="legend-item">
              <span className="dot idle"></span>
              <span>Idle - 閒置中</span>
            </div>
            <div className="legend-item">
              <span className="dot working"></span>
              <span>Working - 工作中</span>
            </div>
            <div className="legend-item">
              <span className="dot done"></span>
              <span>Done - 完成</span>
            </div>
            <div className="legend-item">
              <span className="dot failed"></span>
              <span>Failed - 失敗</span>
            </div>
          </div>
        </section>

        <section className="right-panel">
          <TaskCalendar />
        </section>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #0f0f1a;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 24px;
        }

        .header h1 {
          color: #e0e0e0;
          font-size: 1.5rem;
          margin: 0;
          font-family: "Press Start 2P", monospace;
        }

        .subtitle {
          color: #a0a0b0;
          margin: 8px 0 0;
          font-size: 0.875rem;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }

        .left-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h2 {
          color: #e0e0e0;
          font-size: 1rem;
          margin: 0;
          font-family: "Press Start 2P", monospace;
        }

        .status-indicator {
          color: #22c55e;
          font-size: 0.75rem;
        }

        .game-container {
          aspect-ratio: 4/3;
          background: #0a0a14;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid #2a2a4a;
        }

        .status-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px;
          background: #1e1e2e;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a0a0b0;
          font-size: 0.75rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot.idle { background: #888888; }
        .dot.working { background: #facc15; }
        .dot.done { background: #22c55e; }
        .dot.failed { background: #ef4444; }

        .right-panel {
          min-height: 500px;
        }
      `}</style>
    </div>
  );
}
