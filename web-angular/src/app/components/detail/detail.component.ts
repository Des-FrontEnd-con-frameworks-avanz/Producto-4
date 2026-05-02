import { Component, Input, OnChanges, SimpleChanges,} from '@angular/core';
import { Player } from '@shared/models/player.model';
import { MediaComponent } from '../media/media.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { PlayerService } from '@app/services/player.service';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule,MediaComponent, ReactiveFormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'

})
export class DetailComponent implements OnChanges{
  editForm: FormGroup;
  successMessage = false;
  selectedImage: File | null = null;
  selectedPoster: File | null = null;

  public isEditing: boolean = false;

  @Input() player: Player | null = null;
  mostrarModalVideo: boolean = false;

  public onEditPlayerClick(): void {
    this.player = this.player ? { ...this.player } : null;
    this.isEditing = true;
    console.log('click editar', 'editando: ',this.isEditing, this.player)
  }

  constructor(private fb: FormBuilder, private playerService: PlayerService ){
    this.editForm = this.fb.group({
      nombre:[ ''],
      apellidos: [''],
      posicion: [''],
      edad: [''],
      altura: [''],
      peso: [''],
      experiencia: [''],
      precio: [''],
      descripcion: [''],
      fotoUrl: [''],
      posterUrl: [''],
      videoUrl: ['']
    })
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.player){
      this.editForm.patchValue( this.player)
    }
  }

  public onImageSelected(event: any): void{
    this.selectedImage = event.target.files[0];
  }

  public onPosterSelected(event: any): void{
    this.selectedPoster = event.target.files[0];
  }

  public onCancelClick(): void{
    this.isEditing = false;
  }

  async onSubmit() {
    if (this.editForm.valid && this.player?.id) {
      try {
        const playerId = String(this.player.id);
        const editedData = { ...this.editForm.value };

        if (this.selectedImage){
          editedData.fotoUrl = await this.playerService.uploadFileString(this.selectedImage, 'images/');
        }

        if (this.selectedPoster){
          editedData.posterUrl = await this.playerService.uploadFileString(this.selectedPoster, 'images/');
        }

        await this.playerService.updatePlayer(playerId, editedData);

        this.player = {...this.player, ...editedData}
        this.successMessage = true;
        this.selectedImage = null;
        this.selectedPoster = null;
        this.isEditing = false;

      setTimeout(() => {
        this.successMessage = false;
      }, 3000);

      } catch (error) {
        console.error('Error al guardar el jugador:', error);
      }
    }
  }


}
