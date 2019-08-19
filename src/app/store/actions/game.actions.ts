import { createAction, props } from '@ngrx/store';
import { Game, TimelineCharacter } from '../models/game.model';

export const initGame = createAction(
    '[Game] Init',
    props<{ game: Game }>(),
);

export const updateRoundNumber = createAction(
    '[Game] Update round number',
    props<{ round: number }>(),
);

export const gotoTimelineStep = createAction(
    '[Game] Goto timeline step',
    props<{ step: number }>(),
);

export const updateTimeline = createAction(
    '[Game] Update timeline',
    props<{ timeline: TimelineCharacter[] }>(),
);
