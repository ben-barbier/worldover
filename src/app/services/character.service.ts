import {Injectable} from '@angular/core';
import {Position} from '../store/models/position.model';
import {Arena} from '../store/models/arena.model';
import {ActionType, Character, CharacterAction} from '../store/models/character.model';
import {Square, SquareState} from '../store/models/square.model';
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
        const attackActions: CharacterAction[] = this.getAttackActions(position, character, characters);
        const moveActions: CharacterAction[] = this.getMoveActions(position, character, characters);
        return [...attackActions, ...moveActions];
    }

    private getAttackActions(position, character: Character, characters: Character[]) {
        return [
            {source: position, target: {x: position.x, y: position.y + 1}, type: ActionType.ATTACK_UP},
            {source: position, target: {x: position.x + 1, y: position.y}, type: ActionType.ATTACK_RIGHT},
            {source: position, target: {x: position.x, y: position.y - 1}, type: ActionType.ATTACK_BOTTOM},
            {source: position, target: {x: position.x - 1, y: position.y}, type: ActionType.ATTACK_LEFT},
        ]
            .filter(() => character.healthPoints > 0)
            .filter(() => character.actionPoints > 0)
            .filter(ca => this.positionHasCharacter(ca.target, characters))
            .filter(ca => this.getPositionCharacter(ca.target, characters).healthPoints);
    }

    private getMoveActions(position, character: Character, characters: Character[]) {
        return [
            {target: this.arenaService.getSquare({x: position.x, y: position.y + 1}), type: ActionType.MOVE_UP},
            {target: this.arenaService.getSquare({x: position.x + 1, y: position.y}), type: ActionType.MOVE_RIGHT},
            {target: this.arenaService.getSquare({x: position.x, y: position.y - 1}), type: ActionType.MOVE_BOTTOM},
            {target: this.arenaService.getSquare({x: position.x - 1, y: position.y}), type: ActionType.MOVE_LEFT},
        ]
            .filter(() => character.healthPoints > 0)
            .filter(() => character.actionPoints > 0)
            .filter(ca => this.squareExists(ca.target))
            .filter(ca => this.positionIsFree(ca.target.position, characters))
            .filter(ca => ca.target.state !== SquareState.COLLAPSED)
            .map(ca => ({
                type: ca.type,
                source: position,
                target: ca.target.position,
            }));
    }

    public getPositionCharacter(position: Position, characters: Character[]): Character {
        return characters.find(c => Position.equals(c.position, position));
    }

    private getAvailableSquares(arena: Arena, characters: Character[]): Square[] {
        return arena.squares
            .filter(square => this.squareIsBorder(square, arena))
            .filter(square => this.positionIsFree(square.position, characters))
            .filter(square => this.adjacentSquaresAreFree(square, arena, characters));
    }

    private squareIsBorder(square: Square, arena: Arena) {
        return this.arenaService.getBorders(arena).some(border => Position.equals(border.position, square.position));
    }

    private squareExists(square: Square): boolean {
        return !!square;
    }

    private positionIsFree(position: Position, characters: Character[]) {
        const usedPositions = characters.map(character => character.position);
        return usedPositions.every(usedPosition => !Position.equals(usedPosition, position));
    }

    private positionHasCharacter(position: Position, characters: Character[]): boolean {
        return characters.some(c => Position.equals(c.position, position));
    }

    private adjacentSquaresAreFree(square, arena: Arena, characters: Character[]) {
        return this.getAdjacentSquares(square.position, arena).every(as => this.positionIsFree(as.position, characters));
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
