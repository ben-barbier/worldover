import {Injectable} from '@angular/core';
import {Arena} from '../store/models/arena.model';
import {Square, SquareState} from '../store/models/square.model';
import {Position} from '../store/models/position.model';
import {State} from '@ngrx/store';
import {AppState} from '../store/app.state';

@Injectable({
    providedIn: 'root'
})
export class ArenaService {

    constructor(private state: State<AppState>) {
    }

    public generateArena(height: number, width: number): Arena {
        const squares: Square[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                squares.push({position: {x, y}, state: SquareState.safe});
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
                    return {...square, state: SquareState.collapsed};
                }
                return square;
            }),
        };
    }

    public weakenArena(arena: Arena): Arena {
        const borders = this.getBorders(arena);
        return {
            ...arena,
            squares: arena.squares.map(square => {
                if (borders.some(border => Position.equals(border.position, square.position))) {
                    return {...square, state: SquareState.weakened};
                }
                return square;
            }),
        };
    }

    public getBorders(arena: Arena): Square[] {
        return arena.squares.filter(square => {
            return !!(
                (
                    square.position.x === arena.collapseCount &&
                    square.position.y >= arena.collapseCount &&
                    square.position.y <= arena.height - 1 - arena.collapseCount
                ) || (
                    square.position.x === arena.width - 1 - arena.collapseCount &&
                    square.position.y >= arena.collapseCount &&
                    square.position.y <= arena.height - 1 - arena.collapseCount
                ) || (
                    square.position.y === arena.collapseCount &&
                    square.position.x >= arena.collapseCount &&
                    square.position.x <= arena.width - 1 - arena.collapseCount
                ) || (
                    square.position.y === arena.height - 1 - arena.collapseCount &&
                    square.position.x >= arena.collapseCount &&
                    square.position.x <= arena.width - 1 - arena.collapseCount
                )
            );
        });
    }

    public getSquare(position: Position): Square {
        return this.state.getValue().arena.squares.find(square => Position.equals(square.position, position));
    }

}
