import { Component, input } from '@angular/core';

// models
import { Ball } from '../../models';

@Component({
  selector: 'ball',
  imports: [],
  templateUrl: './ball.component.html',
  styleUrl: './ball.component.scss'
})
export class BallComponent {
  ballPosition = input.required<Ball>();
}
