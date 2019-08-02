import {Injectable} from '@angular/core';
import {Arena} from '../store/models/arena.model';
import {Square} from '../store/models/square.model';
import {Position} from '../store/models/position.model';
import {select, Store} from '@ngrx/store';
import {AppState, arenaSelector} from '../store/app.state';
import {find, first, flatMap, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArenaService {

    constructor(private store: Store<AppState>) {
    }

    public generateArena(height: number, width: number): Arena {
        const squares: Square[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                squares.push({position: {x, y}, collapsed: false});
            }
        }
        return {height, width, squares, collapseCount: 0};
    }

    public collapseArena(arena: Arena): Arena {
        const borders = this.getBorders(arena);
        return {
            ...arena,
            collapseCount: arena.collapseCount + 1,
            squares: arena.squares.map(square => {
                if (borders.some(border => Position.equals(border.position, square.position))) {
                    return {...square, collapsed: true};
                }
                return square;
            }),
        };
    }

    public getBorders(arena: Arena): Square[] {
        return arena.squares.filter(square => {
            return !!(square.position.x === arena.collapseCount ||
                square.position.x === arena.width - 1 - arena.collapseCount ||
                square.position.y === arena.collapseCount ||
                square.position.y === arena.height - 1 - arena.collapseCount);
        });
    }

    public getSquare(position: Position): Observable<Square> {
        return this.store.pipe(
            select(arenaSelector),
            first(), // TODO: obligatoire ?
            map(a => a.squares),
            flatMap(e => e),
            find((square: Square) => Position.equals(square.position, position)), // TODO: Que retourne un find si rien ne match ?
        );
    }

}
