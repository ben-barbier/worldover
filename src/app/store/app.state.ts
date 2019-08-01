import {Arena} from './models/arena.model';
import {Character} from './models/character.model';
import {Game} from './models/game.model';

export interface AppState {
    arena: Arena;
    characters: Character[];
    selectedCharacter: Character;
    game: Game;
}
