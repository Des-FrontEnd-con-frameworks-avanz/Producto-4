import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '@app/shared/models/player.model';

@Pipe({
  name: 'filterPlayers',
  standalone: true
})
export class FilterPlayersPipe implements PipeTransform {

  transform(players: Player[], texto: string, campo: string = 'nombre'): Player[] {
    if (!players) return [];
    if (!texto || texto.trim() === '') return players;

    const termino = texto.toLowerCase().trim();

    return players.filter(player => {
      const valor = (player as any)[campo];
      if (valor === null || valor === undefined) return false;
      return String(valor).toLowerCase().includes(termino);
    });
  }

}
