import { Ball } from './ball.interface';

export interface GameState {
  count: number;
  timeRemaining: number;
  balls: Ball[];
  playerControlPosition: number;
  fieldWidth: number;
  playerControlWidth: number;
  containerHeight: number;
  borders: number;
}
