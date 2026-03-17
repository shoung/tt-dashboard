export const FRAME_WIDTH = 48;
export const FRAME_HEIGHT = 96;
export const SHEET_COLUMNS = 56;
const FRAMES_PER_DIR = 6;
export const MOVE_SPEED = 160;

export interface AnimDef {
  key: string;
  start: number;
  end: number;
  frameRate: number;
  repeat: number;
}

// TT character sprite
export const TT_SPRITE_KEY = "character_02";
export const TT_SPRITE_PATH = "/characters/Premade_Character_48x48_02.png";

const directions = ["right", "up", "left", "down"] as const;
export type Direction = (typeof directions)[number];

export function makeAnims(
  spriteKey: string,
  prefix: string,
  row: number,
  frameRate: number,
): AnimDef[] {
  return directions.map((dir, i) => ({
    key: `${spriteKey}:${prefix}-${dir}`,
    start: row * SHEET_COLUMNS + i * FRAMES_PER_DIR,
    end: row * SHEET_COLUMNS + i * FRAMES_PER_DIR + FRAMES_PER_DIR - 1,
    frameRate,
    repeat: -1,
  }));
}

function rowAnims(prefix: string, row: number, frameRate: number): AnimDef[] {
  return directions.map((dir, i) => ({
    key: `${prefix}-${dir}`,
    start: row * SHEET_COLUMNS + i * FRAMES_PER_DIR,
    end: row * SHEET_COLUMNS + i * FRAMES_PER_DIR + FRAMES_PER_DIR - 1,
    frameRate,
    repeat: -1,
  }));
}

export const IDLE_ANIMS = rowAnims("idle", 1, 8);
export const WALK_ANIMS = rowAnims("walk", 2, 10);
export const ALL_ANIMS: AnimDef[] = [...IDLE_ANIMS, ...WALK_ANIMS];
