import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { initArena } from './store/actions/arena.actions';
import { addCharacter } from './store/actions/characters.actions';
import { initGame } from './store/actions/game.actions';
import { CharacterService } from './services/character.service';
import { ArenaService } from './services/arena.service';
import { TimelineService } from './services/timeline.service';
import { Character } from './store/models/character.model';
import { Position } from './store/models/position.model';
import { Game } from './store/models/game.model';
import { version } from 'package.json';
import { MatDialog } from '@angular/material';
import { SelectCharactersComponent } from './select-characters/select-characters.component';
import { config } from './config';

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
                private dialog: MatDialog,
                private timelineService: TimelineService) {

        dialog.open(SelectCharactersComponent).afterClosed().subscribe((selectedCharacters) => {

            const arena = arenaService.generateArena(config.arenaHeight, config.arenaWidth);
            store.dispatch(initArena({ arena }));

            const characters = selectedCharacters.reduce((charactersTmp, character) => {
                const position: Position = characterService.getRandomAvailablePosition(arena, charactersTmp);
                const characterToAdd: Character = { ...character, position };
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
        });

    }

}
