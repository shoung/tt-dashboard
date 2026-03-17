import * as Phaser from "phaser";
import { FRAME_HEIGHT, makeAnims, type Direction } from "../config/animations";
import {
  WANDER_INITIAL_MIN,
  WANDER_INITIAL_MAX,
  EMOTE_Y_OFFSET,
  BUBBLE_Y_OFFSET,
  BODY_WIDTH,
  BODY_HEIGHT,
  BODY_OFFSET_X,
  BODY_OFFSET_Y,
  MOVE_SPEED,
  WANDER_MIN_DELAY,
  WANDER_MAX_DELAY,
  WANDER_MIN_DURATION,
  WANDER_MAX_DURATION,
  TASK_BUBBLE_MS,
  TASK_RESULT_HOLD_MS,
} from "../config/constants";
import type { WorkerStatus, POI, QueuedTask } from "../types";

interface PathPoint {
  x: number;
  y: number;
}

export class TTWorker {
  sprite: Phaser.Physics.Arcade.Sprite;
  readonly homeX: number;
  readonly homeY: number;
  readonly scene: Phaser.Scene;
  readonly spriteKey: string;

  facing: Direction = "down";
  moveTarget: { x: number; y: number } | null = null;
  currentPath: PathPoint[] = [];
  pathIndex = 0;
  isReturningHome = false;
  
  canWander = true;
  isWandering = false;
  pois: POI[] = [];
  wanderTimer: Phaser.Time.TimerEvent | null = null;
  
  _status: WorkerStatus = "idle";
  currentTaskMessage: string | null = null;
  taskQueue: QueuedTask[] = [];

  private nameTag: Phaser.GameObjects.Text;
  private statusDot: Phaser.GameObjects.Graphics;
  private bubble: Phaser.GameObjects.Container;
  private bubbleText: Phaser.GameObjects.Text;
  private bubbleBg: Phaser.GameObjects.Graphics;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    spriteKey: string,
  ) {
    this.scene = scene;
    this.homeX = x;
    this.homeY = y;
    this.spriteKey = spriteKey;

    this.ensureAnims(scene, spriteKey);

    this.sprite = scene.physics.add.sprite(x, y, spriteKey, 0);
    this.sprite.setDepth(5);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(BODY_WIDTH, BODY_HEIGHT);
    body.setOffset(BODY_OFFSET_X, BODY_OFFSET_Y);
    body.allowGravity = false;
    body.pushable = false;
    body.mass = 999;

    this.sprite.anims.play(`${spriteKey}:idle-down`);

    // Name tag
    const nameY = y + FRAME_HEIGHT / 2 + 2;
    this.nameTag = scene.add
      .text(x, nameY, "TT", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "8px",
        color: "#e0e0e0",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: { x: 4, y: 2 },
        align: "center",
      })
      .setOrigin(0.5, 0)
      .setDepth(20);

    // Status dot
    this.statusDot = scene.add.graphics();
    this.statusDot.setDepth(20);
    this.updateStatusDot();

    // Bubble (task message)
    this.bubbleBg = scene.add.graphics();
    this.bubbleText = scene.add
      .text(0, 0, "", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "8px",
        color: "#ffffff",
        wordWrap: { width: 150 },
      })
      .setOrigin(0.5);
    
    this.bubble = scene.add.container(0, 0, [this.bubbleBg, this.bubbleText]);
    this.bubble.setDepth(21);
    this.bubble.setVisible(false);

    // Start wandering after initial delay
    const initialDelay = Phaser.Math.Between(WANDER_INITIAL_MIN, WANDER_INITIAL_MAX);
    scene.time.delayedCall(initialDelay, () => {
      this.scheduleWander();
    });
  }

  private ensureAnims(scene: Phaser.Scene, spriteKey: string) {
    if (scene.anims.exists(`${spriteKey}:idle-down`)) return;

    const idleAnims = makeAnims(spriteKey, "idle", 1, 8);
    const walkAnims = makeAnims(spriteKey, "walk", 2, 10);
    
    for (const anim of [...idleAnims, ...walkAnims]) {
      const frames: Phaser.Types.Animations.AnimationFrame[] = [];
      for (let i = anim.start; i <= anim.end; i++) {
        frames.push({ key: spriteKey, frame: i });
      }
      scene.anims.create({
        key: anim.key,
        frames,
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    }
  }

  get status(): WorkerStatus {
    return this._status;
  }

  setStatus(status: WorkerStatus) {
    this._status = status;
    this.updateStatusDot();

    if (status === "idle") {
      this.canWander = true;
      this.scheduleWander();
    } else {
      this.canWander = false;
      this.stopWander();
    }
  }

  private updateStatusDot() {
    this.statusDot.clear();
    const colors: Record<WorkerStatus, number> = {
      idle: 0x888888,
      working: 0xfacc15,
      done: 0x22c55e,
      failed: 0xef4444,
    };
    
    const nameY = this.sprite.y + FRAME_HEIGHT / 2 + 2;
    const dotX = this.sprite.x - this.nameTag.width / 2 - 6;
    const dotY = nameY + 4;
    
    this.statusDot.fillStyle(colors[this._status], 1);
    this.statusDot.fillCircle(dotX, dotY, 4);
    
    this.statusDot.setPosition(0, 0); // Reset position, draw at world coords
  }

  // Task management
  assignTask(id: string, message: string) {
    this.stopWander();
    this.currentTaskMessage = message;
    this.setStatus("working");
    this.showBubble(`📋 ${message}`, TASK_BUBBLE_MS);
  }

  completeTask() {
    this.currentTaskMessage = null;
    this.setStatus("done");
    
    this.scene.time.delayedCall(TASK_RESULT_HOLD_MS, () => {
      this.setStatus("idle");
    });
  }

  failTask(message: string = "Task failed.") {
    this.currentTaskMessage = null;
    this.setStatus("failed");
    this.showBubble(message, TASK_BUBBLE_MS);
    
    this.scene.time.delayedCall(TASK_RESULT_HOLD_MS, () => {
      this.setStatus("idle");
    });
  }

  // Bubble
  showBubble(text: string, ttl: number) {
    this.bubbleText.setText(text);
    this.bubbleText.setPosition(0, 0);
    
    const padding = 8;
    const width = this.bubbleText.width + padding * 2;
    const height = this.bubbleText.height + padding * 2;
    
    this.bubbleBg.clear();
    this.bubbleBg.fillStyle(0x000000, 0.8);
    this.bubbleBg.fillRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      8
    );
    
    this.bubble.setPosition(this.sprite.x, this.sprite.y - FRAME_HEIGHT * BUBBLE_Y_OFFSET);
    this.bubble.setVisible(true);

    this.scene.time.delayedCall(ttl, () => {
      this.bubble.setVisible(false);
    });
  }

  // Wander behavior
  scheduleWander() {
    if (!this.canWander || this._status !== "idle") return;
    
    const delay = Phaser.Math.Between(WANDER_MIN_DELAY, WANDER_MAX_DELAY);
    this.wanderTimer = this.scene.time.delayedCall(delay, () => {
      this.startWander();
    });
  }

  private stopWander() {
    if (this.wanderTimer) {
      this.wanderTimer.destroy();
      this.wanderTimer = null;
    }
    this.isWandering = false;
    this.moveTarget = null;
  }

  private startWander() {
    if (!this.canWander || this._status !== "idle") return;
    
    // Simple random wandering within room bounds
    const wanderX = Phaser.Math.Between(100, 600);
    const wanderY = Phaser.Math.Between(100, 400);
    
    this.isWandering = true;
    this.moveTo(wanderX, wanderY);
    
    const duration = Phaser.Math.Between(WANDER_MIN_DURATION, WANDER_MAX_DURATION);
    this.scene.time.delayedCall(duration, () => {
      if (this.isWandering) {
        this.isWandering = false;
        this.moveTarget = null;
        this.sprite.anims.play(`${this.spriteKey}:idle-${this.facing}`);
        this.scheduleWander();
      }
    });
  }

  private moveTo(x: number, y: number) {
    this.moveTarget = { x, y };
    this.pathIndex = 0;
    this.currentPath = this.calculateSimplePath(x, y);
  }

  private calculateSimplePath(targetX: number, targetY: number): PathPoint[] {
    // Simple direct path (no obstacle avoidance for now)
    const dx = targetX - this.sprite.x;
    const dy = targetY - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(distance / MOVE_SPEED * 60); // frames
    
    const path: PathPoint[] = [];
    for (let i = 1; i <= steps; i++) {
      path.push({
        x: this.sprite.x + (dx / steps) * i,
        y: this.sprite.y + (dy / steps) * i,
      });
    }
    return path;
  }

  private updateMovement() {
    if (!this.moveTarget) return;

    const target = this.moveTarget;
    const dx = target.x - this.sprite.x;
    const dy = target.y - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      this.moveTarget = null;
      this.sprite.setVelocity(0, 0);
      if (!this.isWandering) {
        this.sprite.anims.play(`${this.spriteKey}:idle-${this.facing}`);
      }
      return;
    }

    // Determine facing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      this.facing = dx > 0 ? "right" : "left";
    } else {
      this.facing = dy > 0 ? "down" : "up";
    }

    const vx = (dx / distance) * MOVE_SPEED;
    const vy = (dy / distance) * MOVE_SPEED;

    this.sprite.setVelocity(vx, vy);
    this.sprite.anims.play(`${this.spriteKey}:walk-${this.facing}`);
  }

  update() {
    this.updateMovement();

    // Update UI positions
    const nameY = this.sprite.y + FRAME_HEIGHT / 2 + 2;
    this.nameTag.setPosition(this.sprite.x, nameY);
    
    // Redraw status dot
    this.updateStatusDot();
    
    // Update bubble position
    if (this.bubble.visible) {
      this.bubble.setPosition(this.sprite.x, this.sprite.y - FRAME_HEIGHT * BUBBLE_Y_OFFSET);
    }
  }

  destroy() {
    this.stopWander();
    this.sprite.destroy();
    this.nameTag.destroy();
    this.statusDot.destroy();
    this.bubble.destroy();
  }
}

// Export status type for external use
export type { WorkerStatus as Status };
