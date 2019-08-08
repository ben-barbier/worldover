import {createAction, props} from '@ngrx/store';
import {Character, CharacterAction, CharacterOrientation} from '../models/character.model';
import {Position} from '../models/position.model';

export const addCharacter = createAction(
    '[Character] Add',
    props<{ character: Character }>(),
);

export const moveCharacter = createAction(
    '[Character] Move',
    props<{ character: Character, destination: Position, orientation: CharacterOrientation }>(),
);

export const attackCharacter = createAction(
    '[Character] Attack',
    props<{ attacker: Character, target: Character, orientation: CharacterOrientation }>(),
);

export const updateAvailableActions = createAction(
    '[Character] Update available actions',
    props<{ characterName: string, availableActions: CharacterAction[] }>(),
);

export const selectCharacter = createAction(
    '[Character] Select',
    props<{ character: Character }>(),
);
