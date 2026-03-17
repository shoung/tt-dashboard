"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// 定期任務定義
interface RecurringTask {
  id: string;
  title: string;
  description: string;
  dayOfWeek?: number[];
  time: string;
  color: string;
}

const RECURRING_TASKS: RecurringTask[] = [
  {
    id: "daily-backup",
    title: "📦 自動備份",
    description: "每日凌晨 03:00 自動備份到 GitHub 私人倉庫\n\n包含：SOUL.md、MEMORY.md、skills/、memory/、plugins/",
    time: "03:00",
    color: "#8b5cf6",
  },
  {
    id: "daily-healthcheck",
    title: "🏥 網站健康檢查",
    description: "每日檢查網站運行狀態",
    time: "09:00",
    color: "#22c55e",
  },
  {
    id: "daily-gameart",
    title: "🎨 遊戲美術新聞",
    description: "每日 23:00 收集遊戲美術外包產業新聞\n\n來源：x.com、Reddit、5ch.io\n翻譯成簡體中文後發布到 GitHub",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    time: "23:00",
    color: "#f59e0b",
  },
  {
    id: "weekly-youtube",
    title: "📺 GenAI4Humanities 檢查",
    description: "每週檢查 GenAI4Humanities YouTube 頻道是否有新影片",
    dayOfWeek: [1],
    time: "10:00",
    color: "#ef4444",
  },
  {
    id: "weekly-earnings",
    title: "📈 美股財報檢查",
    description: "每週檢查美股持股的財報發布情況\n\n檢查範圍：75 檔股票",
    dayOfWeek: [5],
    time: "14:00",
    color: "#3b82f6",
  },
];

function generateWeeklyEvents(startDate: Date, endDate: Date) {
  const events: any[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];

    for (const task of RECURRING_TASKS) {
      if (task.dayOfWeek && !task.dayOfWeek.includes(dayOfWeek)) {
        continue;
      }

      events.push({
        id: `${task.id}-${dateStr}`,
        title: task.title,
        start: `${dateStr}T${task.time}:00`,
        end: `${dateStr}T${parseInt(task.time.split(":")[0]) + 1}:${task.time.split(":")[1]}:00`,
        backgroundColor: task.color,
        borderColor: task.color,
        extendedProps: {
          description: task.description,
          taskId: task.id,
        },
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return events;
}

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<RecurringTask | null>(null);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 14);
    setEvents(generateWeeklyEvents(start, end));
  }, []);

  const handleEventClick = (info: any) => {
    const task = RECURRING_TASKS.find((t) => t.id === info.event.extendedProps.taskId);
    if (task) {
      setSelectedEvent(task);
    }
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🤖 TT Agent Dashboard</h1>
        <p className="subtitle">我的狀態 & 定期任務</p>
      </header>

      <main className="main-content">
        {/* 左側：像素辦公室 (使用 iframe) */}
        <section className="left-panel">
          <div className="panel-header">
            <h2>🏢 我的辦公室</h2>
            <span className="status-indicator">🟢 Online</span>
          </div>
          
          <div className="game-container">
            <iframe 
              src="/game.html" 
              style={{ 
                width: "100%", 
                height: "100%", 
                border: "none",
                background: "#0a0a14"
              }}
              title="TT Office Game"
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
              events={events}
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

            {selectedEvent && (
              <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header" style={{ borderLeft: `4px solid ${selectedEvent.color}` }}>
                    <h3>{selectedEvent.title}</h3>
                    <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
                  </div>
                  <div className="modal-body">
                    <p><strong>執行時間：</strong> {selectedEvent.time}</p>
                    {selectedEvent.dayOfWeek && (
                      <p><strong>執行日期：</strong> 每週 {
                        selectedEvent.dayOfWeek.map(d => ["日", "一", "二", "三", "四", "五", "六"][d]).join("、")
                      }</p>
                    )}
                    <hr />
                    <div className="description">
                      <strong>任務說明：</strong>
                      <pre>{selectedEvent.description}</pre>
                    </div>
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

        .modal-body p {
          margin: 8px 0;
        }

        .modal-body hr {
          border: none;
          border-top: 1px solid #3d3d5c;
          margin: 16px 0;
        }

        .description pre {
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
