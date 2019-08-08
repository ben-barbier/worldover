import {Arena} from './models/arena.model';
import {Character} from './models/character.model';
import {Game} from './models/game.model';

export interface AppState {
    arena: Arena;
    characters: Character[];
    game: Game;
}

export const arenaSelector = (state: AppState) => state.arena;
export const charactersSelector = (state: AppState) => state.characters;
export const gameSelector = (state: AppState) => state.game;
export const selectedCharacterSelector = (state: AppState) => state.characters.find(c => c.selected);
