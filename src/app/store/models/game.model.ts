export interface Game {
    round: number;
    roundTimeline: TimelineCharacter[];
    timelineCurrentStep: number;
}

export interface TimelineCharacter {
    name: string;
    photo: number;
    alive: boolean;
}
