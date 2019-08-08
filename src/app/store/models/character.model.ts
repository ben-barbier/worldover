import {Position} from './position.model';

export class Character {
    name: string;
    photo: number;
    healthPoints: number;
    healthPointsTotal: number;
    actionPoints: number;
    availableActions: CharacterAction[] = [];
    position: Position;
    orientation: CharacterOrientation;
}

export interface CharacterAction {
    type: ActionType;
    source: Position;
    target: Position;
}

export enum CharacterOrientation {
    BOTTOM = 0,
    LEFT = 1,
    RIGHT = 2,
    TOP = 3,
}

export enum ActionType {
    MOVE_UP,
    MOVE_RIGHT,
    MOVE_BOTTOM,
    MOVE_LEFT,
    ATTACK_UP,
    ATTACK_RIGHT,
    ATTACK_BOTTOM,
    ATTACK_LEFT,
}
