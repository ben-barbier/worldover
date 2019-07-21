export class Position {
    x: number;
    y: number;

    static equals(postition1: Position, position2: Position): boolean {
        return postition1 && position2 &&
            postition1.x === position2.x &&
            postition1.y === position2.y;
    }
}
