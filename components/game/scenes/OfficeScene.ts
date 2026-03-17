import * as Phaser from "phaser";
import { TTWorker } from "../entities/TTWorker";
import { TT_SPRITE_KEY } from "../config/animations";

// 使用 agent-town 的原始 GitHub URL
const AGENT_TOWN_BASE = "https://raw.githubusercontent.com/geezerrrr/agent-town/main/public";

export class OfficeScene extends Phaser.Scene {
  private tt!: TTWorker;

  constructor() {
    super({ key: "OfficeScene" });
  }

  preload() {
    // 從 GitHub 加載地圖
    this.load.tilemapTiledJSON("office", "/maps/office2.json");

    this.load.once("filecomplete-tilemapJSON-office", () => {
      const cached = this.cache.tilemap.get("office");
      if (!cached?.data?.tilesets) return;
      for (const ts of cached.data.tilesets) {
        const basename = (ts.image as string).split("/").pop()!;
        this.load.image(ts.name, `${AGENT_TOWN_BASE}/tilesets/${basename}`);
      }
    });

    // 從 GitHub 加載角色精靈圖
    this.load.spritesheet(
      TT_SPRITE_KEY,
      `${AGENT_TOWN_BASE}/characters/Premade_Character_48x48_02.png`,
      { frameWidth: 48, frameHeight: 96 }
    );
  }

  create() {
    // 建立地圖
    const map = this.make.tilemap({ key: "office" });

    const allTilesets: Phaser.Tilemaps.Tileset[] = [];
    for (const ts of map.tilesets) {
      const added = map.addTilesetImage(ts.name, ts.name);
      if (added) allTilesets.push(added);
    }

    if (allTilesets.length === 0) {
      console.error("No tilesets loaded");
      return;
    }

    // 建立多個圖層
    const floorLayer = map.createLayer("floor", allTilesets);
    const wallsLayer = map.createLayer("walls", allTilesets);
    const groundLayer = map.createLayer("ground", allTilesets);
    const furnitureLayer = map.createLayer("furniture", allTilesets);
    const objectsLayer = map.createLayer("objects", allTilesets);
    const propsLayer = map.createLayer("props", allTilesets);
    const propsOverLayer = map.createLayer("props-over", allTilesets);
    const overheadLayer = map.createLayer("overhead", allTilesets);

    if (overheadLayer) overheadLayer.setDepth(10);

    // 創建 TT 角色在座位上
    this.tt = new TTWorker(this, 350, 320, TT_SPRITE_KEY);

    // 攝影機跟隨 TT
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.tt.sprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.2);

    // 暴露 TT worker 供外部控制
    (window as any).ttWorker = this.tt;
  }

  update() {
    if (this.tt) {
      this.tt.update();
    }
  }
}
