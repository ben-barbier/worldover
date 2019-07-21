import {createAction, props} from '@ngrx/store';
import {Character} from '../models/character.model';

export const selectCharacter = createAction(
    '[Selected Character] Select',
    props<{ character: Character }>(),
);
