import { BehaviorSubject, interval, Subject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';

// models
import { Ball, GameSettings, GameState } from '../models';

// enums
import { MoveType } from '../enums';

@Injectable({ providedIn: 'root' })
export class GameService {

  // BehaviorSubjects for managing the state of game settings and game state
  private settingsState$ = new BehaviorSubject<GameSettings>({} as GameSettings);
  private gameState$ = new BehaviorSubject<GameState>({
    count: 0,
    timeRemaining: 0,
    balls: [],
    playerControlPosition: 0,
    fieldWidth: 800,
    playerControlWidth: 200,
    containerHeight: 800,
    borders: 6
  });

  // Observable streams to provide access to the game state and settings
  private destroy$ = new Subject<void>();
  settingsStateObs$ = this.settingsState$.asObservable();
  gameStateObs$ = this.gameState$.asObservable();

  // Update the game settings based on the provided settings object
  updateSettings(settings: GameSettings): void {
    this.settingsState$.next(settings);
  }

  // Start the game logic: intervals for handling time and ball updates
  startGame() {
    console.log(this.settingsState$.value);
    // Clear any previous interval and reset the destroy signal
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$ = new Subject<void>();

    let balls: Ball[] = [];
    let count = 0;
    let timeRemaining = this.settingsState$.value.gameTime;
    let lastSpawnTime = Date.now();
    let lastUpdateTime = Date.now();

    // Update the time remaining every second
    interval(1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (timeRemaining <= 0) {
        balls = [];
        // Stop the game if time runs out
        this.destroy$.next();
        return;
      }

      // Decrement the time and update the game state
      timeRemaining = Math.max(0, timeRemaining - 1);

      this.setGameState({
        ...this.gameState$.value,
        count,
        timeRemaining,
        balls,
        playerControlPosition: this.gameState$.value.playerControlPosition
      });
    });

    // Update the ball positions and game state every 16 milliseconds (for smoother updates)
    interval(16).pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentTime = Date.now();
      lastUpdateTime = currentTime;

      // Move balls down the field and filter out balls that have fallen out of view
      balls = balls
        .map(obj => ({ ...obj, top: obj.top + this.settingsState$.value.fallingSpeed }))
        .filter(obj => obj.top < this.gameState$.value.containerHeight);

      // Spawn new balls at random positions after a certain time interval
      if (balls.length === 0 || (Date.now() - lastSpawnTime) > this.settingsState$.value.fallingFrequency) {
        balls.push({ left: Math.random() * 2000, top: 0, counted: false });
        lastSpawnTime = Date.now();
      }

      // Check for collisions between the player control and falling balls
      balls.forEach(obj => {
        if (
          obj.top >= this.gameState$.value.containerHeight - this.gameState$.value.playerControlWidth &&
          obj.top <= this.gameState$.value.containerHeight &&
          obj.left >= this.gameState$.value.playerControlPosition &&
          obj.left <= this.gameState$.value.playerControlPosition + this.gameState$.value.playerControlWidth &&
          !obj.counted
        ) {
          // Mark the ball as counted and increase the score
          obj.counted = true;
          setTimeout(() => {
            count++;
          }, 500)
        }
      });

      // Update the game state after processing the balls and count
      this.setGameState({
        ...this.gameState$.value,
        count,
        timeRemaining,
        balls,
        playerControlPosition: this.gameState$.value.playerControlPosition
      });
    });
  }

  // Set the new game state to update the game data
  setGameState(gameState: GameState): void {
    this.gameState$.next(gameState);
  }

  // Calculate the player control position based on the arrow key press
  // Move the player control left or right, ensuring it doesn't go out of bounds
  calculatePlayerControlPosition(gameState: GameState, gameSettings: GameSettings, moveType: string): number {
    let playerPosition = 0;

    if (moveType === MoveType.ArrowLeft) {
      // Prevent the player control from going past the left side
      playerPosition = Math.max(0, gameState.playerControlPosition - gameSettings.playerSpeed);
    }
    if (moveType === MoveType.ArrowRight) {
      // Prevent the player control from going past the right side
      const maxWidth = gameState.fieldWidth - gameState.playerControlWidth - gameState.borders;
      playerPosition = Math.min(maxWidth, gameState.playerControlPosition + gameSettings.playerSpeed);
    }

    return playerPosition;
  }
}
