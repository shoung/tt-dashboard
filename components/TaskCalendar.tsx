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
  dayOfWeek?: number[]; // 0=Sun, 1=Mon, etc.
  time: string; // HH:mm
  color: string;
}

const RECURRING_TASKS: RecurringTask[] = [
  {
    id: "daily-backup",
    title: "📦 自動備份",
    description: "每日凌晨 03:00 自動備份到 GitHub 私人倉庫（shoung/openclaw-backup）\n\n包含：SOUL.md、MEMORY.md、skills/、memory/、plugins/、.system-config/",
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
    dayOfWeek: [1], // Monday
    time: "10:00",
    color: "#ef4444",
  },
  {
    id: "weekly-earnings",
    title: "📈 美股財報檢查",
    description: "每週檢查美股持股的財報發布情況\n\n檢查範圍：17aj60uD1x3jlrtqxzOJ0vnfa7udHA-43O0a7BfjaMPM 中的 75 檔股票",
    dayOfWeek: [5], // Friday
    time: "14:00",
    color: "#3b82f6",
  },
];

// 生成每週事件
function generateWeeklyEvents(startDate: Date, endDate: Date) {
  const events: any[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split("T")[0];

    for (const task of RECURRING_TASKS) {
      // 檢查這天是否應該執行
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

export default function TaskCalendar() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<RecurringTask | null>(null);
  const [calendarStart, setCalendarStart] = useState<Date>(new Date());

  useEffect(() => {
    // 生成從今天開始的 2 週事件
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

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
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

      {/* Task Detail Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ borderLeft: `4px solid ${selectedEvent.color}` }}>
              <h3>{selectedEvent.title}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
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

      <style jsx>{`
        .calendar-container {
          background: #1e1e2e;
          border-radius: 12px;
          padding: 20px;
          height: 100%;
          overflow: auto;
        }

        .calendar-header {
          margin-bottom: 16px;
        }

        .calendar-header h2 {
          color: #e0e0e0;
          font-size: 1.25rem;
          margin: 0;
          font-family: "Press Start 2P", monospace;
        }

        :global(.fc) {
          --fc-border-color: #3d3d5c;
          --fc-button-bg-color: #4a4a6a;
          --fc-button-border-color: #4a4a6a;
          --fc-button-hover-bg-color: #5a5a7a;
          --fc-button-hover-border-color: #5a5a7a;
          --fc-button-active-bg-color: #6a6a8a;
          --fc-today-bg-color: rgba(99, 102, 241, 0.15);
          --fc-event-bg-color: #6366f1;
          --fc-event-border-color: #6366f1;
          --fc-page-bg-color: #1e1e2e;
          --fc-neutral-bg-color: #2a2a3e;
        }

        :global(.fc-theme-standard td),
        :global(.fc-theme-standard th) {
          border-color: #3d3d5c;
        }

        :global(.fc-col-header-cell-cushion),
        :global(.fc-daygrid-day-number) {
          color: #e0e0e0;
          text-decoration: none;
        }

        :global(.fc-timegrid-slot-label-cushion) {
          color: #a0a0b0;
          font-size: 0.75rem;
        }

        :global(.fc-event) {
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.75rem;
          padding: 2px 4px;
        }

        :global(.fc-event:hover) {
          filter: brightness(1.1);
        }

        :global(.fc-button) {
          font-family: "Press Start 2P", monospace;
          font-size: 0.6rem;
        }

        :global(.fc-toolbar-title) {
          color: #e0e0e0;
          font-size: 1rem !important;
        }

        :global(.fc-daygrid-event) {
          white-space: normal !important;
        }

        /* Modal */
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
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow: auto;
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
          padding: 0;
          line-height: 1;
        }

        .close-btn:hover {
          color: #fff;
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
          line-height: 1.5;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
