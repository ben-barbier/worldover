import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {concatMap, map, withLatestFrom} from 'rxjs/operators';
import {AppState, arenaSelector} from '../app.state';
import {select, State, Store} from '@ngrx/store';
import * as GameActions from '../actions/game.actions';
import * as ArenaActions from '../actions/arena.actions';
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
                if (nextRound % 2) {
                    const collapsedArena = this.arenaService.collapseArena(arena);
                    return ArenaActions.updateArena({updatedArena: collapsedArena});
                } else {
                    const weakenedArena = this.arenaService.weakenArena(arena);
                    return ArenaActions.updateArena({updatedArena: weakenedArena});
                }
            }),
        )
    );

    constructor(private actions: Actions,
                private state: State<AppState>,
                private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService) {
    }

}
