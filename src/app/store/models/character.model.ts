import { Position } from './position.model';

export class Character {
    name: string;
    photo: number;
    healthPoints: number;
    healthPointsTotal: number;
    actionPoints: number;
    availableActions: CharacterAction[] = [];
    position: Position;
    orientation: CharacterOrientation;
    selected: boolean;
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
    MOVE_UP = 1, // Useful to not consider MOVE_UP falsy
    MOVE_RIGHT,
    MOVE_BOTTOM,
    MOVE_LEFT,
    ATTACK_UP,
    ATTACK_RIGHT,
    ATTACK_BOTTOM,
    ATTACK_LEFT,
}

export const ActionTypeCategory = {
    MOVE: [ActionType.MOVE_UP, ActionType.MOVE_RIGHT, ActionType.MOVE_BOTTOM, ActionType.MOVE_LEFT],
    ATTACK: [ActionType.ATTACK_UP, ActionType.ATTACK_RIGHT, ActionType.ATTACK_BOTTOM, ActionType.ATTACK_LEFT],
};
