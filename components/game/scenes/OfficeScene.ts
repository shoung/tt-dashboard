import * as Phaser from "phaser";
import { TTWorker } from "../entities/TTWorker";
import { TT_SPRITE_KEY, TT_SPRITE_PATH } from "../config/animations";

export class OfficeScene extends Phaser.Scene {
  private tt!: TTWorker;

  constructor() {
    super({ key: "OfficeScene" });
  }

  preload() {
    // Load tilemap
    this.load.tilemapTiledJSON("office", "/maps/office2.json");

    this.load.once("filecomplete-tilemapJSON-office", () => {
      const cached = this.cache.tilemap.get("office");
      if (!cached?.data?.tilesets) return;
      for (const ts of cached.data.tilesets) {
        const basename = (ts.image as string).split("/").pop()!;
        this.load.image(ts.name, `/tilesets/${basename}`);
      }
    });

    // Load character sprite
    this.load.image(TT_SPRITE_KEY, TT_SPRITE_PATH);
  }

  create() {
    // Build sprite frames for character
    const sheetColumns = 56;
    const frameWidth = 48;
    const frameHeight = 96;

    // Generate all frames
    for (let row = 1; row <= 2; row++) {
      for (let col = 0; col < sheetColumns; col++) {
        const frame = row * sheetColumns + col;
        // Just preload the texture region
      }
    }

    // Create tilemap
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

    // Create layers
    map.createLayer("floor", allTilesets);
    map.createLayer("walls", allTilesets);
    map.createLayer("ground", allTilesets);
    map.createLayer("furniture", allTilesets);
    map.createLayer("objects", allTilesets);
    map.createLayer("props", allTilesets);
    map.createLayer("props-over", allTilesets);

    const overheadLayer = map.createLayer("overhead", allTilesets);
    if (overheadLayer) overheadLayer.setDepth(10);

    // Create TT worker at a desk position
    // Based on office2.json, let's pick a reasonable position
    this.tt = new TTWorker(this, 300, 280, TT_SPRITE_KEY);

    // Make camera follow TT
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.tt.sprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.5);

    // Expose TT worker for external control
    (window as any).ttWorker = this.tt;
  }

  update() {
    if (this.tt) {
      this.tt.update();
    }
  }
}
