import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {sortBy as _sortBy} from 'lodash';
import {Arena} from '../store/models/arena.model';

@Component({
    selector: 'app-arena',
    templateUrl: './arena.component.html',
    styleUrls: ['./arena.component.scss'],
})
export class ArenaComponent {

    public arena: Observable<Arena> = this.store.pipe(
        select('arena'),
        map(ArenaComponent.orderSquares),
    );

    constructor(private store: Store<AppState>) {
    }

    private static orderSquares(arena: Arena): Arena {
        const sortedSquares = _sortBy(arena.squares, square => -(square.position.y * 1_000) + square.position.x);
        return {...arena, squares: sortedSquares};
    }

}
