import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayersComponent } from '@app/components/players/players.component';
import { Player } from '@app/shared/models/player.model';
import { DetailComponent } from '@app/components/detail/detail.component';
import { CommonModule } from '@angular/common';
import { AddPlayerComponent } from '@app/components/add-player/add-player.component';
import { PlayerService } from '@app/services/player.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, PlayersComponent, DetailComponent, AddPlayerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  @ViewChild(DetailComponent) detailComponent?: DetailComponent;

  public players: Player[] = [];
  public selectedPlayer: Player | null = null;
  public isAdding: boolean = false;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((data) => {
      this.players = data;

      if(this.selectedPlayer){
        const jugadorActualizado = this.players.find(p => p.id === this.selectedPlayer?.id)

        if(jugadorActualizado){
          this.selectedPlayer= {...jugadorActualizado}
        }else {
          this.selectedPlayer = null;
        }
      }

    });
  }

  public handlePlayerSelection(player: Player): void {
    this.selectedPlayer = { ...player };
    this.isAdding = false;
  }

  public onNewPlayerClick(): void {
    this.selectedPlayer = null;
    this.isAdding = true;
  }

  public onPlayerAdded(): void {
    this.isAdding = false;
  }
}
