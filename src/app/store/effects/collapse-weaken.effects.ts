import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CharacterService} from '../../services/character.service';
import {concatMap, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {AppState, arenaSelector, charactersSelector, gameSelector} from '../app.state';
import {Action, State, Store} from '@ngrx/store';
import * as GameActions from '../actions/game.actions';
import * as ArenaActions from '../actions/arena.actions';
import * as CharactersActions from '../actions/characters.actions';
import {of} from 'rxjs';
import {ArenaService} from '../../services/arena.service';
import {Character} from '../models/character.model';
import {Arena} from '../models/arena.model';
import {Position} from '../models/position.model';
import {SquareState} from '../models/square.model';

// TODO: est-ce un effect ? Ce ne devrait pas jiuste être dans un service (arenaService? / collapseService?)
@Injectable()
export class CollapseWeakenEffects {

    collapseArena$ = createEffect(() =>
        this.actions.pipe(
            ofType(GameActions.gotoNextRound),
            concatMap(action => of(action).pipe(
                withLatestFrom(
                    this.store.select(arenaSelector),
                    this.store.select(gameSelector),
                    this.store.select(charactersSelector),
                ),
            )),
            filter(([action, arena, game, characters]) => {
                const nextRound = game.round;
                return !!(nextRound % 2);
            }),
            switchMap(([action, arena, game, characters]) => {
                const collapsedArena = this.arenaService.collapseArena(arena);
                const charactersOnCollapsedSquare: Character[] = this.getCharactersOnCollapsedSquare(characters, arena);
                const killCharactersActions: Action[] = charactersOnCollapsedSquare.map(
                    character => CharactersActions.characterKilled({character})
                );
                return killCharactersActions.concat(ArenaActions.updateArena({updatedArena: collapsedArena}));
            }),
        )
    );

    weakenArena$ = createEffect(() =>
        this.actions.pipe(
            ofType(GameActions.gotoNextRound),
            concatMap(action => of(action).pipe(
                withLatestFrom(
                    this.store.select(arenaSelector),
                    this.store.select(gameSelector),
                ),
            )),
            filter(([action, arena, game]) => {
                const nextRound = game.round;
                return !(nextRound % 2);
            }),
            map(([action, arena, game]) => {
                const weakenedArena = this.arenaService.weakenArena(arena);
                return ArenaActions.updateArena({updatedArena: weakenedArena});
            }),
        )
    );

    private getCharactersOnCollapsedSquare(characters: Character[], arena: Arena): Character[] {
        return characters.filter(character =>
            arena.squares.find(square =>
                // FIXME: a virer dans un service (tt l'effect) + remplacer WEAKENED par COLLAPSED
                Position.equals(character.position, square.position) && square.state === SquareState.WEAKENED
            )
        );
    }

    constructor(private actions: Actions,
                private state: State<AppState>,
                private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService) {
    }

}
