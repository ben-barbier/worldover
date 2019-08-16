import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store/app.state';
import {initArena} from './store/actions/arena.actions';
import {addCharacter} from './store/actions/characters.actions';
import {CharacterService} from './services/character.service';
import {ArenaService} from './services/arena.service';
import {Character, CharacterOrientation} from './store/models/character.model';
import {Position} from './store/models/position.model';
import {Game} from './store/models/game.model';
import {GameService} from './services/game.service';
import {initGame} from './store/actions/game.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService,
                private gameService: GameService) {

        const arena = arenaService.generateArena(5, 5);
        store.dispatch(initArena({arena}));

        const characters = [
            {name: 'Bob', healthPointsTotal: 3, photo: 1/*, playerId: 1*/},
            {name: 'Alice', healthPointsTotal: 3, photo: 2/*, playerId: 1*/},
            {name: 'Ken', healthPointsTotal: 3, photo: 3/*, playerId: 2*/},
            {name: 'Ada', healthPointsTotal: 3, photo: 5/*, playerId: 2*/},
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
                // playerId: character.playerId,
            };
            characterToAdd.availableActions = characterService.getAvailableActions(characterToAdd);
            store.dispatch(addCharacter({character: characterToAdd}));
            return [...charactersTmp, characterToAdd];
        }, []);

        // const players = [
        //     {id: 1, name: 'Player 1'},
        //     {id: 2, name: 'Player 2'},
        // ];

        const game: Game = {
            round: 1,
            roundTimeline: gameService.generateRoundTimeline(1, characters/*, players*/),
            timelineCurrentStep: 1,
            // players
        };
        store.dispatch(initGame({game}));

    }

}
