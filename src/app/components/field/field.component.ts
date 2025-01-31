import { Component, input } from '@angular/core';

// components
import { BallListComponent } from '../ball-list/ball-list.component';
import { PlayerComponent } from '../player-control/player-control.component';

// models
import { GameState } from '../../models';

// models

@Component({
  selector: 'field',
  imports: [
    BallListComponent,
    PlayerComponent
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  gameState = input.required<GameState>();
}
