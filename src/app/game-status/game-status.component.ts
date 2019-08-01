import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, gameSelector} from '../store/app.state';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-game-status',
    templateUrl: './game-status.component.html',
    styleUrls: ['./game-status.component.scss']
})
export class GameStatusComponent {

    public round: Observable<number> = this.store.pipe(
        select(gameSelector),
        map(game => game.round),
    );

    constructor(private store: Store<AppState>) {
    }

}
