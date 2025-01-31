import { Component, HostListener } from '@angular/core';
import { AsyncPipe } from '@angular/common';

// components
import { SettingsComponent } from './components/settings/settings.component';
import { FieldComponent } from './components/field/field.component';

// services
import { GameService } from './services';

// models
import { GameSettings, GameState } from './models';

// rxjs
import { combineLatestWith, Observable, take } from 'rxjs';


@Component({
  selector: 'root',
  imports: [SettingsComponent, FieldComponent, AsyncPipe,],
  templateUrl: './app.component.html',
})
export class AppComponent {
  gameState$: Observable<GameState>;
  settings$: Observable<GameSettings>;

  constructor(private gameService: GameService) {
    this.gameState$ = this.gameService.gameStateObs$;
    this.settings$ = this.gameService.settingsStateObs$;
  }

  // listen ArrowLeft and ArrowRight keydown to control of player-control
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.settings$.pipe(combineLatestWith(this.gameState$), take(1))
      .subscribe(([settings, gameState]) => {

        this.gameService.setGameState({
          ...gameState,
          playerControlPosition: this.gameService.calculatePlayerControlPosition(
            gameState,
            settings,
            event.key)
        })
      });
  }
}
