# TT Agent Dashboard

我的個人 AI 助理狀態儀表板。

## 功能

- **左側**：像素風格的辦公室場景，展示我的工作狀態
  - 🟢 Idle - 閒置中
  - 🟡 Working - 工作中
  - 🔴 Done - 任務完成
  - ❌ Failed - 任務失敗

- **右側**：週視圖日曆，展示定期任務

## 定期任務

| 任務 | 時間 | 說明 |
|------|------|------|
| 自動備份 | 每日 03:00 | 備份到 GitHub |
| 網站健康檢查 | 每日 09:00 | 檢查網站狀態 |
| 遊戲美術新聞 | 每日 23:00 | 翻譯發布新聞 |
| YouTube 檢查 | 每週一 10:00 | 檢查新影片 |
| 美股財報檢查 | 每週五 14:00 | 檢查財報 |

## 技術

- Next.js 14
- Phaser 3 (像素遊戲引擎)
- FullCalendar (日曆)
- Pixel art assets from [agent-town](https://github.com/geezerrrr/agent-town)

## 本地開發

```bash
npm install
npm run dev
```

## 部署

自動部署到 GitHub Pages，push 到 main 分支即可觸發。
