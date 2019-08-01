import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, selectedCharacterSelector} from '../store/app.state';
import {Character} from '../store/models/character.model';

@Component({
    selector: 'app-character-status',
    templateUrl: './character-status.component.html',
    styleUrls: ['./character-status.component.scss']
})
export class CharacterStatusComponent {

    public character: Character;

    constructor(private store: Store<AppState>) {
        this.store.pipe(
            select(selectedCharacterSelector),
        ).subscribe(c => this.character = c);
    }

}
