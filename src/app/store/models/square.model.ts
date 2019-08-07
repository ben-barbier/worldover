import {Position} from './position.model';

export enum SquareState {
    'safe',
    'weakened',
    'collapsed',
}

export class Square {
    position: Position;
    state: SquareState;
}
