import {Position} from './position.model';

export class Character {
    name: string;
    photo: number;
    healthPoints: number;
    healthPointsTotal: number;
    availableActions: CharacterAction[] = [];
    position: Position;
}

export interface CharacterAction {
    type: ActionType;
    source: Position;
    target: Position;
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
