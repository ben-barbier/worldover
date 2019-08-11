import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, gameSelector} from '../store/app.state';
import {gotoNextRound, gotoTimelineStep} from '../store/actions/game.actions';
import {Game, TimelineCharacter} from '../store/models/game.model';
import {Character} from '../store/models/character.model';
import {selectCharacter} from '../store/actions/characters.actions';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private game: Game;

    constructor(private store: Store<AppState>) {
        this.store.select(gameSelector).subscribe(game => this.game = game);
    }

    public validateCharacterActions(): void {
        const nextStepOnSameRound = this.game.roundTimeline.findIndex((c, idx) => {
            return c.alive && (idx + 1) > this.game.timelineCurrentStep;
        }) + 1;
        if (nextStepOnSameRound) {
            this.store.dispatch(gotoTimelineStep({step: nextStepOnSameRound}));
            const nextCharacter = this.game.roundTimeline.find((c, idx) => c.alive && idx >= (this.game.timelineCurrentStep - 1));
            this.store.dispatch(selectCharacter({characterName: nextCharacter.name}));
        } else {
            this.store.dispatch(gotoNextRound());
            const nextCharacter = this.game.roundTimeline.find(c => c.alive);
            this.store.dispatch(selectCharacter({characterName: nextCharacter.name}));
        }
    }

    public generateRoundTimeline(round: number, characters: Character[]): TimelineCharacter[] {
        return characters
            .filter(c => c.healthPoints > 0)
            .map(c => ({name: c.name, photo: c.photo, alive: true}));
    }

}
