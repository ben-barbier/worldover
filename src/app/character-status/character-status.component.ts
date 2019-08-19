import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, selectedCharacterSelector } from '../store/app.state';
import { Character } from '../store/models/character.model';
import { GameService } from '../services/game.service';

@Component({
    selector: 'app-character-status',
    templateUrl: './character-status.component.html',
    styleUrls: ['./character-status.component.scss']
})
export class CharacterStatusComponent {

    public character: Character;

    constructor(private store: Store<AppState>,
                private gameService: GameService) {
        this.store.pipe(select(selectedCharacterSelector)).subscribe(character => this.character = character);
    }

    public validateActions() {
        this.gameService.validateCharacterActions();
    }

}
