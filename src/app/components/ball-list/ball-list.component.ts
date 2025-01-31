import { Component, input } from '@angular/core';

// models
import { Ball } from '../../models';

// components
import { BallComponent } from "../ball/ball.component";

@Component({
  selector: 'ball-list',
  imports: [BallComponent],
  templateUrl: './ball-list.component.html',
  styleUrl: './ball-list.component.scss'
})
export class BallListComponent {
  balls = input.required<Ball[]>();
}
