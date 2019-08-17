import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, arenaSelector, charactersSelector, gameSelector} from '../store/app.state';
import {Game} from '../store/models/game.model';
import {Character} from '../store/models/character.model';
import {TimelineService} from './timeline.service';
import {ArenaService} from './arena.service';
import {Arena} from '../store/models/arena.model';
import {updateArena} from '../store/actions/arena.actions';
import {CharacterService} from './character.service';
import * as CharactersActions from '../store/actions/characters.actions';
import * as GameActions from '../store/actions/game.actions';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private game: Game;
    private arena: Arena;
    private characters: Character[];

    constructor(private store: Store<AppState>,
                private timelineService: TimelineService,
                private characterService: CharacterService,
                private arenaService: ArenaService) {
        this.store.select(gameSelector).subscribe(game => this.game = game);
        this.store.select(arenaSelector).subscribe(arena => this.arena = arena);
        this.store.select(charactersSelector).subscribe(characters => this.characters = characters);
    }

    public validateCharacterActions(): void {
        const nextStepOnSameRound = this.game.roundTimeline.findIndex((c, idx) => {
            return c.alive && (idx + 1) > this.game.timelineCurrentStep;
        }) + 1;
        if (nextStepOnSameRound) {
            this.gotoNextStep(nextStepOnSameRound);
        } else {
            this.gotoNextRound();
        }
        this.characterService.refreshSelectedCharacterAvailableActions();
    }

    private gotoNextStep(step: number): void {
        this.store.dispatch(GameActions.gotoTimelineStep({step}));
        const nextCharacter = this.game.roundTimeline.find((c, idx) => c.alive && idx >= (this.game.timelineCurrentStep - 1));
        this.store.dispatch(CharactersActions.selectCharacter({characterName: nextCharacter.name}));
    }

    private gotoNextRound(): void {

        const nextRound = this.game.round + 1;
        this.store.dispatch(GameActions.updateRoundNumber({round: nextRound}));

        if (nextRound % 2) {

            const collapsedArena = this.arenaService.collapseArena(this.arena);
            this.store.dispatch(updateArena({updatedArena: collapsedArena}));

            const charactersOnCollapsedSquare = this.arenaService.getCharactersOnCollapsedSquare(this.characters, collapsedArena);
            charactersOnCollapsedSquare.forEach(character => this.store.dispatch(CharactersActions.killCharacter({character})));

            const updatedTimeline = this.timelineService.generateTimeline(this.characters);
            this.store.dispatch(GameActions.updateTimeline({timeline: updatedTimeline}));

            const nextCharacter = updatedTimeline.find(c => c.alive);
            this.store.dispatch(CharactersActions.selectCharacter({characterName: nextCharacter.name}));

        } else {

            const weakenedArena = this.arenaService.weakenArena(this.arena);
            this.store.dispatch(updateArena({updatedArena: weakenedArena}));

            const nextCharacter = this.game.roundTimeline.find(c => c.alive);
            this.store.dispatch(CharactersActions.selectCharacter({characterName: nextCharacter.name}));

        }

    }

}
