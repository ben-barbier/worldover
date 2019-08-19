import { Injectable } from '@angular/core';
import { Position } from '../store/models/position.model';
import { Arena } from '../store/models/arena.model';
import { ActionType, Character, CharacterAction, CharacterOrientation } from '../store/models/character.model';
import { Square, SquareState } from '../store/models/square.model';
import { ArenaService } from './arena.service';
import { Store } from '@ngrx/store';
import { AppState, charactersSelector, selectedCharacterSelector } from '../store/app.state';
import { AudioService, Sound } from './audio.service';
import * as CharactersActions from '../store/actions/characters.actions';
import {GameOverService} from './game-over.service';

@Injectable({
    providedIn: 'root'
})
export class CharacterService {

    private characters: Character[];

    private selectedCharacter: Character;

    constructor(private arenaService: ArenaService,
                private audioService: AudioService,
                private gameOverService: GameOverService,
                private store: Store<AppState>) {
        this.store.select(charactersSelector).subscribe(characters => this.characters = characters);
        this.store.select(selectedCharacterSelector).subscribe(selectedCharacter => this.selectedCharacter = selectedCharacter);
    }

    public getRandomAvailablePosition(arena: Arena, characters: Character[]): Position {
        const availableSquares = this.getAvailableSquares(arena, characters);
        return availableSquares[Math.floor(Math.random() * availableSquares.length)].position;
    }

    public getAvailableActions(character: Character): CharacterAction[] {
        const position = character.position;
        const attackActions: CharacterAction[] = this.getAttackActions(position, character, this.characters);
        const moveActions: CharacterAction[] = this.getMoveActions(position, character, this.characters);
        return [...attackActions, ...moveActions];
    }

    public attack(actionType: ActionType, attacker: Character, target: Character): void {
        this.audioService.playAudio(Sound.ATTACK);
        this.store.dispatch(CharactersActions.attackCharacter({
            attacker,
            orientation: this.getOrientation(actionType),
        }));
        this.store.dispatch(CharactersActions.damageCharacter({
            character: target,
            damage: 1,
        }));
        this.refreshSelectedCharacterAvailableActions();
        this.gameOverService.check();
    }

    public move(actionType: ActionType, character: Character, destination: Position): void {
        this.store.dispatch(CharactersActions.moveCharacter({
            character,
            destination,
            orientation: this.getOrientation(actionType),
        }));
        this.refreshSelectedCharacterAvailableActions();
    }

    private getAttackActions(position: Position, character: Character, characters: Character[]): CharacterAction[] {
        return [
            { source: position, target: { x: position.x, y: position.y + 1 }, type: ActionType.ATTACK_UP },
            { source: position, target: { x: position.x + 1, y: position.y }, type: ActionType.ATTACK_RIGHT },
            { source: position, target: { x: position.x, y: position.y - 1 }, type: ActionType.ATTACK_BOTTOM },
            { source: position, target: { x: position.x - 1, y: position.y }, type: ActionType.ATTACK_LEFT },
        ]
            .filter(() => character.healthPoints > 0)
            .filter(() => character.actionPoints > 0)
            .filter(ca => this.positionHasAliveCharacter(ca.target, characters))
            .filter(ca => this.getPositionAliveCharacter(ca.target, characters));
    }

    private getMoveActions(position: Position, character: Character, characters: Character[]): CharacterAction[] {
        return [
            { target: this.arenaService.getSquare({ x: position.x, y: position.y + 1 }), type: ActionType.MOVE_UP },
            { target: this.arenaService.getSquare({ x: position.x + 1, y: position.y }), type: ActionType.MOVE_RIGHT },
            { target: this.arenaService.getSquare({ x: position.x, y: position.y - 1 }), type: ActionType.MOVE_BOTTOM },
            { target: this.arenaService.getSquare({ x: position.x - 1, y: position.y }), type: ActionType.MOVE_LEFT },
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

    public getPositionAliveCharacter(position: Position, characters: Character[]): Character {
        return characters.find(c => Position.equals(c.position, position) && c.healthPoints > 0);
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
        const usedPositions = characters
            .filter(character => character.healthPoints > 0)
            .map(character => character.position);
        return usedPositions.every(usedPosition => !Position.equals(usedPosition, position));
    }

    private positionHasAliveCharacter(position: Position, characters: Character[]): boolean {
        return characters.some(c => Position.equals(c.position, position) && c.healthPoints > 0);
    }

    private adjacentSquaresAreFree(square, arena: Arena, characters: Character[]) {
        return this.getAdjacentSquares(square.position, arena).every(as => this.positionIsFree(as.position, characters));
    }

    private getAdjacentSquares(position: Position, arena: Arena): Square[] {
        return arena.squares.filter((square) => {
            return square.position.x === position.x && square.position.y + 1 === position.y || // ⬆
                square.position.x + 1 === position.x && square.position.y === position.y ||    // ➡
                square.position.x === position.x && square.position.y - 1 === position.y ||    // ⬇
                square.position.x - 1 === position.x && square.position.y === position.y;      // ⬅
        });
    }

    public getOrientation(actionType: ActionType): CharacterOrientation {
        return [
            { action: ActionType.MOVE_UP, orientation: CharacterOrientation.TOP },
            { action: ActionType.MOVE_RIGHT, orientation: CharacterOrientation.RIGHT },
            { action: ActionType.MOVE_BOTTOM, orientation: CharacterOrientation.BOTTOM },
            { action: ActionType.MOVE_LEFT, orientation: CharacterOrientation.LEFT },
            { action: ActionType.ATTACK_UP, orientation: CharacterOrientation.TOP },
            { action: ActionType.ATTACK_RIGHT, orientation: CharacterOrientation.RIGHT },
            { action: ActionType.ATTACK_BOTTOM, orientation: CharacterOrientation.BOTTOM },
            { action: ActionType.ATTACK_LEFT, orientation: CharacterOrientation.LEFT },
        ].find(e => e.action === actionType).orientation;
    }

    public refreshSelectedCharacterAvailableActions(): void {
        this.store.dispatch(CharactersActions.updateAvailableActions({
            characterName: this.selectedCharacter.name,
            availableActions: this.getAvailableActions(this.selectedCharacter),
        }));
    }

}
