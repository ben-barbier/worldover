import {createAction, props} from '@ngrx/store';
import {Character, CharacterAction} from '../models/character.model';
import {Position} from '../models/position.model';

export const addCharacter = createAction(
    '[Character] Add',
    props<{ character: Character }>(),
);

export const moveCharacter = createAction(
    '[Character] Move',
    props<{ character: Character, destination: Position }>(),
);

export const attackCharacter = createAction(
    '[Character] Attack',
    props<{ attacker: Character, target: Character }>(),
);

export const updateAvailableActions = createAction(
    '[Character] Update available actions',
    props<{ characterName: string, availableActions: CharacterAction[] }>(),
);
