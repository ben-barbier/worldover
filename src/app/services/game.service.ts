import {Injectable} from '@angular/core';
import {State, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {updateRound} from '../store/actions/game.actions';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(private state: State<AppState>,
                private store: Store<AppState>) {
    }

    public goToTheNextRound(): void {
        const nextRound = this.state.getValue().game.round + 1;
        this.store.dispatch(updateRound({round: nextRound}));
    }
}
