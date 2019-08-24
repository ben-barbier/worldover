import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
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
import { SelectInstanceComponent } from './select-instance/select-instance.component';
import { InstanceService } from './services/instance.service';
import * as CharactersActions from './store/actions/characters.actions';
import * as ArenaActions from './store/actions/arena.actions';
import * as GameActions from './store/actions/game.actions';
import { AngularFirestore } from '@angular/fire/firestore';

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
                private timelineService: TimelineService,
                private instanceService: InstanceService,
                private afs: AngularFirestore) {

        dialog.open(SelectInstanceComponent).afterClosed().subscribe(({ instanceName, instanceExists }) => {

            this.instanceService.setInstanceName(instanceName);

            if (instanceExists) {
                this.instanceService.observeInstance(instanceName);
            } else {
                dialog.open(SelectCharactersComponent).afterClosed().subscribe((selectedCharacters) => {

                    const arena = arenaService.generateArena(config.arenaHeight, config.arenaWidth);
                    store.dispatch(ArenaActions.initArena({ arena }));

                    const characters = selectedCharacters.reduce((charactersTmp, character) => {
                        const position: Position = characterService.getRandomAvailablePosition(arena, charactersTmp);
                        const characterToAdd: Character = { ...character, position, selected: !charactersTmp.length };
                        characterToAdd.availableActions = characterService.getAvailableActions(characterToAdd);
                        store.dispatch(CharactersActions.addCharacter({ character: characterToAdd }));
                        return [...charactersTmp, characterToAdd];
                    }, []);

                    const game: Game = {
                        round: 1,
                        roundTimeline: timelineService.generateTimeline(characters),
                        timelineCurrentStep: 1,
                    };
                    store.dispatch(GameActions.initGame({ game }));

                    this.instanceService.createInstance(instanceName, arena, game, characters);
                    this.instanceService.observeInstance(instanceName);

                });
            }
        });

    }

}
