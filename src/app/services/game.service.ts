import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, gameSelector} from '../store/app.state';
import {updateRound} from '../store/actions/game.actions';
import {first, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private store: Store<AppState>) {
    }

    public goToTheNextRound(): void {
        this.store.pipe(
            select(gameSelector),
            first(),
            map(game => game.round + 1),
        ).subscribe(nextRound => {
            this.store.dispatch(updateRound({round: nextRound}));
        });
    }
}
