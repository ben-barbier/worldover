export interface Game {
    round: number;
    roundTimeline: TimelineCharacter[];
    timelineCurrentStep: number;
    // players: Player[];
}

export interface TimelineCharacter {
    name: string;
    photo: number;
    alive: boolean;
    // playerId: number;
}

// export interface Player {
//     id: number;
//     name: string;
// }
