import { Position } from './position.model';

export enum SquareState {
    SAFE,
    WEAKENED,
    COLLAPSED,
}

export enum SquareStyle {
    TOP_LEFT_CORNER,
    TOP_CENTER,
    TOP_RIGHT_CORNER,
    MIDDLE_LEFT,
    MIDDLE_CENTER,
    MIDDLE_RIGHT,
    BOTTOM_LEFT_CORNER,
    BOTTOM_CENTER,
    BOTTOM_RIGHT_CORNER,
    SINGLE,
    EMPTY,
}

export class Square {
    position: Position;
    state: SquareState;
    style: SquareStyle;
}
