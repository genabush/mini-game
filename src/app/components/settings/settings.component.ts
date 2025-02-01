import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// services
import { GameService } from '../../services';

// rxjs
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'settings',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  pattern = '^[1-9][0-9]*'; // validator for negative numbers
  errorText = (title: string) => `${title} should be positive numbers only`;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private gameService: GameService) {
    this.settingsForm = this.fb.group({
      fallingSpeed: [1, [Validators.required, Validators.pattern(this.pattern)]],
      fallingFrequency: [500, [Validators.required, Validators.pattern(this.pattern)]],
      playerSpeed: [10, [Validators.required, Validators.pattern(this.pattern)]],
      gameTime: [100, [Validators.required, Validators.pattern(this.pattern)]],
    });
    this.gameService.updateSettings(this.settingsForm.value);
  }

  ngOnInit(): void {
    // listen gameTime formControlName to start new game if value in control was changed 
    this.listenGameTimeChanges();
    // listen form value changes to update settings for the game on fly
    this.listenFormValueChanges();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  startGame(): void {
    this.gameService.startGame();
  }

  private listenFormValueChanges(): void {
    this.settingsForm.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.settingsForm.valid) {
          this.gameService.updateSettings(value);
        }
      });
  }

  private listenGameTimeChanges(): void {
    this.settingsForm?.get('gameTime')?.valueChanges.pipe(
      takeUntil(this.destroy$))
      .subscribe(_value => {
        if (this.settingsForm.valid) {
          setTimeout(() => {
            this.gameService.startGame();
          }, 0)
        }
      });
  }
}
