import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player } from '../../shared/models/player.model';
import { CurrencyExchangePipe } from '@app/shared/pipes/currency-exchange.pipe';
import { FiltroEdadPipe } from '../../pipes/filtro-edad.pipe';
import { FilterPlayersPipe } from '@app/shared/pipes/filter-players.pipe';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyExchangePipe, FiltroEdadPipe, FilterPlayersPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss'
})
export class PlayersComponent implements OnInit {
  public players: Player[] = [];
  public selectedPlayerId: string | null | undefined = null; 
  public selectedCurrency: string = 'EUR';
  public filtroEdad: string = 'todas';
  public textoBusqueda: string = '';
  public campoBusqueda: string = 'nombre';

  @Output() playerSelected = new EventEmitter<Player>();

  constructor(private playerService: PlayerService) {}

ngOnInit(): void {
    console.log('=== Iniciando Carga de Jugadores en Tiempo Real ===');

    this.playerService.getPlayers().subscribe({
      next: (data: any[]) => {
        console.log('Respuesta de Firebase (Longitud):', data.length);
        
        if (data.length === 0) {
          console.warn('La colección está VACÍA. Si no ves nada, ejecuta seedDatabase() una vez.');
        } else {
          console.log('Datos recibidos con éxito:', data);
        }

        this.players = data;
      },
      error: (err) => {
        console.error('Error de conexión con Firebase:', err);
      }
    });
  }

  public onSelectPlayer(player: Player): void {
    this.selectedPlayerId = player.id ? String(player.id) : null;
    this.playerSelected.emit(player);
  }

  public onCurrencyChange(event: Event): void {
    const selectedElement = event.target as HTMLSelectElement;
    this.selectedCurrency = selectedElement.value;
  }

  public eliminarJugador(id: string | number | undefined): void {
    if (!id) return; 
    const idString = String(id);

    if (confirm('¿Estás seguro de que deseas eliminar este jugador?')) {
      this.playerService.deletePlayer(idString)
        .then(() => {
          console.log('Jugador borrado de Firebase');
          if (this.selectedPlayerId === idString) {
            this.selectedPlayerId = null;
          }
        })
        .catch(error => console.error('Error al eliminar:', error));
    }
  }
  
}