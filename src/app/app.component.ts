import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { initArena } from './store/actions/arena.actions';
import { addCharacter } from './store/actions/characters.actions';
import { initGame } from './store/actions/game.actions';
import { CharacterService } from './services/character.service';
import { ArenaService } from './services/arena.service';
import { TimelineService } from './services/timeline.service';
import { Character, CharacterOrientation } from './store/models/character.model';
import { Position } from './store/models/position.model';
import { Game } from './store/models/game.model';
import { version } from 'package.json';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public version: string = version;

    constructor(private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService,
                private timelineService: TimelineService) {

        const arena = arenaService.generateArena(5, 5);
        store.dispatch(initArena({ arena }));

        const characters = [
            { name: 'Bob', healthPointsTotal: 3, photo: 1 },
            { name: 'Alice', healthPointsTotal: 3, photo: 2 },
            { name: 'Ken', healthPointsTotal: 3, photo: 3 },
            { name: 'Ada', healthPointsTotal: 3, photo: 5 },
        ].reduce((charactersTmp, character) => {
            const position: Position = characterService.getRandomAvailablePosition(arena, charactersTmp);
            const characterToAdd: Character = {
                ...character,
                position,
                availableActions: [],
                orientation: CharacterOrientation.BOTTOM,
                healthPoints: character.healthPointsTotal,
                actionPoints: character.healthPointsTotal,
                selected: false,
            };
            characterToAdd.availableActions = characterService.getAvailableActions(characterToAdd);
            store.dispatch(addCharacter({ character: characterToAdd }));
            return [...charactersTmp, characterToAdd];
        }, []);

        const game: Game = {
            round: 1,
            roundTimeline: timelineService.generateTimeline(characters),
            timelineCurrentStep: 1,
        };
        store.dispatch(initGame({ game }));

    }

}
