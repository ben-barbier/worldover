import {Arena} from './models/arena.model';
import {Character} from './models/character.model';

export interface AppState {
    arena: Arena;
    characters: Character[];
    selectedCharacter: Character;
}
