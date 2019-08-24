import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, tap } from 'rxjs/operators';
import { FirebaseService } from '../../services/firebase.service';
import * as CharactersActions from '../actions/characters.actions';
import * as GameActions from '../actions/game.actions';
import * as ArenaActions from '../actions/arena.actions';

@Injectable()
export class FirebaseEffects {

    constructor(private actions$: Actions,
                private firebaseService: FirebaseService) {
    }

    $firebaseSync = createEffect(() => this.actions$.pipe(
        ofType(
            CharactersActions.moveCharacter,
            CharactersActions.attackCharacter,
            CharactersActions.damageCharacter,
            CharactersActions.killCharacter,
            GameActions.gotoTimelineStep,
            GameActions.updateRoundNumber,
            ArenaActions.updateArena,
        ),
        debounceTime(10), // prevent multiple push on successive actions
        tap(() => this.firebaseService.pushStateToFirebase()),
    ), { dispatch: false });

}
