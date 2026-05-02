import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '@app/shared/models/player.model';

@Pipe({
  name: 'filtroEdad',
})
export class FiltroEdadPipe implements PipeTransform {

 transform(players: Player[], edadSeleccionada: string): Player[] {

    if (!players) return [];

    if (!edadSeleccionada || edadSeleccionada === 'todas') {
      return players;
    }

    return players.filter(player => {
      if (edadSeleccionada === 'jovenes') {
        return player.edad < 30;
      }

      if (edadSeleccionada === 'veterano') {
        return player.edad >= 30;
      }

      return true;
    });
  }
}
