import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {AppState, arenaSelector} from '../app.state';
import {select, State, Store} from '@ngrx/store';
import * as GameActions from '../actions/game.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as CoreActions from '../actions/core.actions';
import {of} from 'rxjs';
import {ArenaService} from '../../services/arena.service';

@Injectable()
export class ArenaEffects {

    goToTheNextRound$ = createEffect(() =>
        this.actions.pipe(
            ofType(GameActions.updateRound),
            concatMap(action => of(action).pipe(
                withLatestFrom(this.store.pipe(select(arenaSelector)))
            )),
            map(([action, arena]) => {
                const nextRound = action.round;
                if (nextRound > 1 && nextRound % 2) {
                    const collapsedArena = this.arenaService.collapseArena(arena);
                    return ArenaActions.collapseArena({collapsedArena});
                }
                return CoreActions.noopAction();
            }),
        )
    );

    constructor(private actions: Actions,
                private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService) {
    }

}
