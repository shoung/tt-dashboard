"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        background: "#0f0f1a", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: "#e0e0e0"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
          --bg-dark: #0f0f1a;
          --bg-panel: #1e1e2e;
          --bg-card: #2a2a3e;
          --border: #3d3d5c;
          --text: #e0e0e0;
          --text-dim: #a0a0b0;
          --accent: #6366f1;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg-dark);
          color: var(--text);
          min-height: 100vh;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          margin-bottom: 24px;
        }
        
        .header h1 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        
        .header .subtitle {
          color: var(--text-dim);
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
        
        .panel {
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
          font-size: 1rem;
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
          border: 2px solid var(--border);
        }
        
        .game-container iframe {
          width: 100%;
          height: 100%;
          border: none;
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
          font-size: 0.75rem;
          z-index: 10;
        }
        
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .status-dot.idle { background: #888; }
        .status-dot.working { background: #facc15; }
        .status-dot.done { background: #22c55e; }
        .status-dot.failed { background: #ef4444; }
        
        .status-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding: 12px;
          background: var(--bg-panel);
          border-radius: 8px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dim);
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
          background: var(--bg-panel);
          border-radius: 12px;
          padding: 20px;
          height: 100%;
          min-height: 500px;
        }
        
        .calendar-header {
          margin-bottom: 16px;
        }
        
        .calendar-header h2 {
          font-size: 1rem;
        }
        
        .fc {
          --fc-border-color: #3d3d5c;
          --fc-button-bg-color: #4a4a6a;
          --fc-button-border-color: #4a4a6a;
          --fc-today-bg-color: rgba(99, 102, 241, 0.15);
        }
        
        .fc-theme-standard td,
        .fc-theme-standard th {
          border-color: #3d3d5c;
        }
        
        .fc-col-header-cell-cushion,
        .fc-daygrid-day-number {
          color: var(--text);
        }
        
        .fc-event {
          cursor: pointer;
          border-radius: 4px;
        }
        
        .fc-button {
          font-size: 0.6rem;
        }
        
        .fc-toolbar-title {
          color: var(--text);
          font-size: 1rem;
        }
      `}</style>

      <header className="header">
        <h1>🤖 TT Agent Dashboard</h1>
        <p className="subtitle">我的狀態 & 定期任務</p>
      </header>

      <main className="main-content">
        {/* 左側：像素辦公室 */}
        <section className="panel left-panel">
          <div className="panel-header">
            <h2>🏢 我的辦公室</h2>
            <span className="status-indicator">🟢 Online</span>
          </div>
          
          <div className="game-container" style={{ position: "relative" }}>
            <iframe 
              src="/game.html"
              style={{ width: "100%", height: "100%", border: "none", background: "#0a0a14" }}
              title="TT Office Game"
            ></iframe>
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
        <section className="panel right-panel">
          <div className="calendar-container">
            <div className="calendar-header">
              <h2>📅 定期任務</h2>
            </div>
            <div id="calendar"></div>
          </div>
        </section>
      </main>

      <script dangerouslySetInnerHTML={{__html: \`
        // 定期任務
        const tasks = [
          { id: 'backup', title: '📦 自動備份', days: [0,1,2,3,4,5,6], time: '03:00', color: '#8b5cf6', desc: '每日備份到 GitHub' },
          { id: 'health', title: '🏥 網站健康檢查', days: [0,1,2,3,4,5,6], time: '09:00', color: '#22c55e', desc: '檢查網站狀態' },
          { id: 'gameart', title: '🎨 遊戲美術新聞', days: [0,1,2,3,4,5,6], time: '23:00', color: '#f59e0b', desc: '翻譯發布新聞' },
          { id: 'youtube', title: '📺 YouTube 檢查', days: [1], time: '10:00', color: '#ef4444', desc: '檢查新影片' },
          { id: 'earnings', title: '📈 美股財報', days: [5], time: '14:00', color: '#3b82f6', desc: '檢查財報' },
        ];

        function generateEvents() {
          const events = [];
          const now = new Date();
          const start = new Date(now);
          start.setHours(0, 0, 0, 0);
          const end = new Date(start);
          end.setDate(end.getDate() + 14);

          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            const dateStr = d.toISOString().split('T')[0];

            for (const task of tasks) {
              if (!task.days.includes(dayOfWeek)) continue;
              
              const [hour, min] = task.time.split(':');
              const startDate = new Date(dateStr);
              startDate.setHours(parseInt(hour), parseInt(min), 0);
              
              const endDate = new Date(startDate);
              endDate.setHours(endDate.getHours() + 1);

              events.push({
                id: task.id + '-' + dateStr,
                title: task.title,
                start: startDate,
                end: endDate,
                backgroundColor: task.color,
                borderColor: task.color,
                extendedProps: { description: task.desc }
              });
            }
          }
          return events;
        }

        document.addEventListener('DOMContentLoaded', function() {
          const calendarEl = document.getElementById('calendar');
          const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'timeGridWeek',
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: generateEvents(),
            slotMinTime: '00:00:00',
            slotMaxTime: '24:00:00',
            allDaySlot: false,
            height: 'auto',
            nowIndicator: true,
            locale: 'zh-tw',
            buttonText: {
              today: '今天',
              month: '月',
              week: '週',
              day: '日'
            },
            eventClick: function(info) {
              alert(info.event.title + '\\n\\n' + info.event.extendedProps.description);
            }
          });
          calendar.render();
        });
      \`}} />
    </>
  );
}
