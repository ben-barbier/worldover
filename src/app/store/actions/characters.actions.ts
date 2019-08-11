import {createAction, props} from '@ngrx/store';
import {Character, CharacterAction, CharacterOrientation} from '../models/character.model';
import {Position} from '../models/position.model';

export const addCharacter = createAction(
    '[Character] Add character',
    props<{ character: Character }>(),
);

export const moveCharacter = createAction(
    '[Character] Move character',
    props<{ character: Character, destination: Position, orientation: CharacterOrientation }>(),
);

export const attackCharacter = createAction(
    '[Character] Attack character',
    props<{ attacker: Character, orientation: CharacterOrientation }>(),
);

export const characterDamaged = createAction(
    '[Character] Character damaged',
    props<{ character: Character, damage: number }>(),
);

export const characterKilled = createAction(
    '[Character] Character killed',
    props<{ character: Character }>(),
);

export const updateAvailableActions = createAction(
    '[Character] Update available actions',
    props<{ characterName: string, availableActions: CharacterAction[] }>(),
);

export const selectCharacter = createAction(
    '[Character] Select character',
    props<{ characterName: string }>(),
);
