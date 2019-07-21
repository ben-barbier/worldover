import {Injectable} from '@angular/core';
import {Position} from '../store/models/position.model';
import {Arena} from '../store/models/arena.model';
import {ActionType, Character, CharacterAction} from '../store/models/character.model';
import {Square} from '../store/models/square.model';
import {ArenaService} from './arena.service';
import {State} from '@ngrx/store';
import {AppState} from '../store/app.state';

@Injectable({
    providedIn: 'root'
})
export class CharacterService {

    constructor(private arenaService: ArenaService,
                private state: State<AppState>) {
    }

    public getRandomAvailablePosition(arena: Arena, characters: Character[]): Position {
        const availableSquares = this.getAvailableSquares(arena, characters);
        return availableSquares[Math.floor(Math.random() * availableSquares.length)].position;
    }

    public getAvailableActions(character: Character): CharacterAction[] {

        const position = character.position;
        const characters: Character[] = this.state.getValue().characters;

        return [
            {target: this.arenaService.getSquare({x: position.x - 1, y: position.y}), type: ActionType.MOVE_LEFT},
            {target: this.arenaService.getSquare({x: position.x, y: position.y - 1}), type: ActionType.MOVE_BOTTOM},
            {target: this.arenaService.getSquare({x: position.x + 1, y: position.y}), type: ActionType.MOVE_RIGHT},
            {target: this.arenaService.getSquare({x: position.x, y: position.y + 1}), type: ActionType.MOVE_UP},
        ]
            .filter(e => character.healthPoints > 0)
            .filter(e => this.squareExists(e.target))
            .filter(e => this.squareIsFree(e.target, characters))
            .filter(e => !e.target.collapsed)
            .map(e => ({
                type: e.type,
                source: position,
                target: e.target.position,
            }));

    }

    private getAvailableSquares(arena: Arena, characters: Character[]): Square[] {
        return arena.squares
            .filter(square => this.squareIsBorder(square, arena))
            .filter(square => this.squareIsFree(square, characters))
            .filter(square => this.adjacentSquaresAreFree(square, arena, characters));
    }

    private squareIsBorder(square: Square, arena: Arena) {
        return this.arenaService.getBorders(arena).some(border => Position.equals(border.position, square.position));
    }

    private squareExists(square: Square): boolean {
        return !!square;
    }

    private squareIsFree(square: Square, characters: Character[]) {
        const usedPositions = characters.map(character => character.position);
        return usedPositions.every(usedPosition => !Position.equals(usedPosition, square.position));
    }

    private adjacentSquaresAreFree(square, arena: Arena, characters: Character[]) {
        return this.getAdjacentSquares(square.position, arena).every(adjacentSquare => this.squareIsFree(adjacentSquare, characters));
    }

    private getAdjacentSquares(position: Position, arena: Arena): Square[] {
        return arena.squares.filter(s => {
            return s.position.x === position.x && s.position.y + 1 === position.y || // ⬆
                s.position.x + 1 === position.x && s.position.y === position.y ||    // ➡
                s.position.x === position.x && s.position.y - 1 === position.y ||    // ⬇
                s.position.x - 1 === position.x && s.position.y === position.y;      // ⬅
        });
    }
}
