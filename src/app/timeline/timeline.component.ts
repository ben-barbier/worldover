import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, gameSelector } from '../store/app.state';
import { TimelineCharacter } from '../store/models/game.model';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {

    public round: number;
    public roundTimeline: TimelineCharacter[];
    public timelineCurrentStep: number;

    constructor(private store: Store<AppState>) {
        this.store.select(gameSelector).subscribe((game) => {
            this.round = game.round;
            this.roundTimeline = game.roundTimeline;
            this.timelineCurrentStep = game.timelineCurrentStep;
        });
    }

}
