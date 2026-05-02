import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '@app/shared/models/player.model';
import { PlayerService } from '@app/services/player.service';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-player.component.html',
  styleUrl: './add-player.component.scss'
})
export class AddPlayerComponent {
  playerForm: FormGroup;
  successMessage = false;

  @Output() playerAdded = new EventEmitter<void>();

  selectedImage: File | null = null;
  selectedPoster: File | null = null;

  constructor(private fb: FormBuilder, private playerService: PlayerService) {
    this.playerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      posicion: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(0)]],
      altura: ['', Validators.required],
      peso: ['', Validators.required],
      experiencia: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
      fotoUrl: [''],
      posterUrl: [''],
      videoUrl: ['']

    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onPosterSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPoster = file;
    }
  }

  async onSubmit() {
    if (this.playerForm.valid) {
      try {
        const formData = this.playerForm.value;
        const newPlayer: Player = { ...formData };

        if (this.selectedImage) {
          newPlayer.fotoUrl = await this.playerService.uploadFileString(this.selectedImage, 'images/');
        }

        if (this.selectedPoster){
          newPlayer.posterUrl = await this.playerService.uploadFileString(this.selectedPoster, 'images/');
        } else {
          newPlayer.posterUrl = '/images/poster.jpg'
        }

        await this.playerService.addPlayer(newPlayer);

        this.successMessage = true;
        this.playerForm.reset();
        this.selectedImage = null;
        this.selectedPoster = null;

        const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
        fileInputs.forEach(input => input.value = '');

        setTimeout(() => {
          this.successMessage = false;
          this.playerAdded.emit();
        }, 3000);
      } catch (error) {
        console.error('Error al guardar el jugador:', error);
      }
    } else {
      this.playerForm.markAllAsTouched();
    }
  }

  getControlError(controlName: string): boolean {
    const control = this.playerForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

