import {Injectable} from '@angular/core';
import {Arena} from '../store/models/arena.model';
import {Square, SquareState, SquareStyle} from '../store/models/square.model';
import {Position} from '../store/models/position.model';
import {Store} from '@ngrx/store';
import {AppState, arenaSelector} from '../store/app.state';
import {Character} from '../store/models/character.model';

@Injectable({
    providedIn: 'root'
})
export class ArenaService {

    private arena: Arena;

    constructor(private store: Store<AppState>) {
        store.select(arenaSelector).subscribe(arena => this.arena = arena);
    }

    public generateArena(height: number, width: number): Arena {
        const squares: Square[] = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                squares.push({position: {x, y}, state: SquareState.SAFE, style: this.getStyle(height, width, {x, y})});
            }
        }
        return {height, width, squares, collapseCount: 0};
    }

    public collapseArena(arena: Arena): Arena {
        const borders = this.getBorders(arena);
        const collapseCount = arena.collapseCount + 1;
        return {
            ...arena,
            collapseCount,
            squares: arena.squares.map(square => ({
                ...square,
                style: this.getStyle(arena.height, arena.width, square.position, collapseCount),
            })).map(square => {
                if (borders.some(border => Position.equals(border.position, square.position))) {
                    return {...square, state: SquareState.COLLAPSED};
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
                    return {...square, state: SquareState.WEAKENED};
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
        return this.arena.squares.find(square => Position.equals(square.position, position));
    }

    public getCharactersOnCollapsedSquare(characters: Character[], arena: Arena): Character[] {
        return characters.filter(character =>
            arena.squares.find(square =>
                Position.equals(character.position, square.position) && square.state === SquareState.COLLAPSED
            )
        );
    }

    private getStyle(arenaHeight: number, arenaWidth: number, position: Position, collapseCount: number = 0): SquareStyle {

        if (arenaHeight === arenaWidth &&
            position.x === collapseCount &&
            position.y === collapseCount &&
            Math.floor(arenaHeight / collapseCount) === collapseCount) {
            return SquareStyle.SINGLE;
        }

        if (position.y === collapseCount) {
            if (position.x === collapseCount) {
                return SquareStyle.BOTTOM_LEFT_CORNER;
            } else if (position.x === arenaWidth - 1 - collapseCount) {
                return SquareStyle.BOTTOM_RIGHT_CORNER;
            } else if (position.x > collapseCount && position.x < arenaWidth - 1 - collapseCount) {
                return SquareStyle.BOTTOM_CENTER;
            } else {
                return SquareStyle.EMPTY;
            }
        } else if (position.y === arenaHeight - 1 - collapseCount) {
            if (position.x === collapseCount) {
                return SquareStyle.TOP_LEFT_CORNER;
            } else if (position.x === arenaWidth - 1 - collapseCount) {
                return SquareStyle.TOP_RIGHT_CORNER;
            } else if (position.x > collapseCount && position.x < arenaWidth - 1 - collapseCount) {
                return SquareStyle.TOP_CENTER;
            } else {
                return SquareStyle.EMPTY;
            }
        } else if (position.y > collapseCount && position.y < arenaHeight - 1 - collapseCount) {
            if (position.x === collapseCount) {
                return SquareStyle.MIDDLE_LEFT;
            } else if (position.x === arenaWidth - 1 - collapseCount) {
                return SquareStyle.MIDDLE_RIGHT;
            } else if (position.x > collapseCount && position.x < arenaWidth - 1 - collapseCount) {
                return SquareStyle.MIDDLE_CENTER;
            } else {
                return SquareStyle.EMPTY;
            }
        } else {
            return SquareStyle.EMPTY;
        }
    }

}
