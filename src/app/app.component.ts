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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(private store: Store<AppState>,
                private characterService: CharacterService,
                private arenaService: ArenaService) {

        const game: Game = {round: 1};
        const arena = arenaService.generateArena(5, 5);
        store.dispatch(initArena({arena}));

        [
            {name: 'Bob', healthPointsTotal: 3, photo: 1},
            {name: 'Alice', healthPointsTotal: 3, photo: 2},
            {name: 'Ken', healthPointsTotal: 3, photo: 3},
            {name: 'Ada', healthPointsTotal: 3, photo: 5},
        ].reduce((characters, character) => {
            const position: Position = characterService.getRandomAvailablePosition(arena, characters);
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
            store.dispatch(addCharacter({character: characterToAdd}));
            return [...characters, characterToAdd];
        }, []);

    }

}
