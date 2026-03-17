"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// 假數據 - 測試用
const FAKE_EVENTS = [
  { id: "1", title: "📦 自動備份", start: "2026-03-18T03:00:00", end: "2026-03-18T03:30:00", backgroundColor: "#8b5cf6", borderColor: "#8b5cf6", extendedProps: { description: "每日備份到 GitHub" } },
  { id: "2", title: "🏥 網站健康檢查", start: "2026-03-18T09:00:00", end: "2026-03-18T09:30:00", backgroundColor: "#22c55e", borderColor: "#22c55e", extendedProps: { description: "檢查網站狀態" } },
  { id: "3", title: "🎨 遊戲美術新聞", start: "2026-03-18T23:00:00", end: "2026-03-18T23:30:00", backgroundColor: "#f59e0b", borderColor: "#f59e0b", extendedProps: { description: "翻譯發布新聞" } },
  { id: "4", title: "📺 YouTube 檢查", start: "2026-03-23T10:00:00", end: "2026-03-23T10:30:00", backgroundColor: "#ef4444", borderColor: "#ef4444", extendedProps: { description: "檢查新影片" } },
  { id: "5", title: "📈 美股財報", start: "2026-03-20T14:00:00", end: "2026-03-20T14:30:00", backgroundColor: "#3b82f6", borderColor: "#3b82f6", extendedProps: { description: "檢查財報" } },
];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🤖 TT Agent Dashboard</h1>
        <p className="subtitle">我的狀態 & 定期任務</p>
      </header>

      <main className="main-content">
        {/* 左側：像素辦公室 */}
        <section className="left-panel">
          <div className="panel-header">
            <h2>🏢 我的辦公室</h2>
            <span className="status-indicator">🟢 Online</span>
          </div>
          
          <div className="game-container">
            {/* 暫時用靜態圖片 */}
            <img 
              src="https://raw.githubusercontent.com/geezerrrr/agent-town/main/public/characters/Premade_Character_48x48_02.png" 
              alt="TT Pixel Character"
              style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
            />
            <div className="status-overlay">
              <span className="status-dot idle"></span>
              <span>狀態：Idle (閒置中)</span>
            </div>
          </div>

          <div className="status-legend">
            <div className="legend-item">
              <span className="dot idle"></span>
              <span>Idle - 閒置</span>
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

        {/* 右側：日曆 */}
        <section className="right-panel">
          <div className="calendar-container">
            <div className="calendar-header">
              <h2>📅 定期任務</h2>
            </div>
            
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={FAKE_EVENTS}
              eventClick={handleEventClick}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              allDaySlot={false}
              height="auto"
              eventDisplay="block"
              slotDuration="01:00:00"
              nowIndicator={true}
              locale="zh-tw"
              buttonText={{
                today: "今天",
                month: "月",
                week: "週",
                day: "日",
              }}
            />

            {/* 任務說明彈窗 */}
            {selectedEvent && (
              <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>{selectedEvent.title || "任務詳情"}</h3>
                    <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <pre>{selectedEvent.description}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>
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
        }

        .subtitle {
          color: #a0a0b0;
          margin: 8px 0 0;
          font-size: 0.875rem;
        }

        /* 左右分屏 */
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

        .left-panel, .right-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h2, .calendar-header h2 {
          color: #e0e0e0;
          font-size: 1rem;
          margin: 0;
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
          position: relative;
        }

        .status-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: rgba(0,0,0,0.8);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e0e0e0;
          font-size: 0.75rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .status-dot.idle { background: #888; }

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
        .dot.idle { background: #888; }
        .dot.working { background: #facc15; }
        .dot.done { background: #22c55e; }
        .dot.failed { background: #ef4444; }

        .calendar-container {
          background: #1e1e2e;
          border-radius: 12px;
          padding: 20px;
          height: 100%;
          overflow: auto;
        }

        /* FullCalendar 樣式 */
        :global(.fc) {
          --fc-border-color: #3d3d5c;
          --fc-button-bg-color: #4a4a6a;
          --fc-button-border-color: #4a4a6a;
          --fc-today-bg-color: rgba(99, 102, 241, 0.15);
        }

        :global(.fc-theme-standard td),
        :global(.fc-theme-standard th) {
          border-color: #3d3d5c;
        }

        :global(.fc-col-header-cell-cushion),
        :global(.fc-daygrid-day-number) {
          color: #e0e0e0;
        }

        :global(.fc-event) {
          cursor: pointer;
          border-radius: 4px;
        }

        :global(.fc-button) {
          font-size: 0.6rem;
        }

        :global(.fc-toolbar-title) {
          color: #e0e0e0;
          font-size: 1rem;
        }

        /* 彈窗 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: #2a2a3e;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #1e1e2e;
          border-radius: 12px 12px 0 0;
        }

        .modal-header h3 {
          margin: 0;
          color: #e0e0e0;
          font-size: 1rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: #a0a0b0;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-body {
          padding: 20px;
          color: #c0c0d0;
        }

        .modal-body pre {
          background: #1e1e2e;
          padding: 12px;
          border-radius: 8px;
          white-space: pre-wrap;
          font-family: inherit;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
