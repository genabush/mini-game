import { Component, input } from '@angular/core';

@Component({
  selector: 'player-control',
  imports: [],
  templateUrl: './player-control.component.html',
  styleUrl: './player-control.component.scss'
})
export class PlayerComponent {
  playerPosition = input.required<number>();

}
