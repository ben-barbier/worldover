import {Component, Input} from '@angular/core';
import {Character} from '../../store/models/character.model';
import {AppState} from '../../store/app.state';
import {Store} from '@ngrx/store';
import {selectCharacter} from '../../store/actions/selected-character.actions';

@Component({
    selector: 'app-character',
    templateUrl: './character.component.html',
    styleUrls: ['./character.component.scss']
})
export class CharacterComponent {

    @Input()
    public character: Character;

    constructor(private store: Store<AppState>) {
    }

    public selectCharacter(character: Character) {
        this.store.dispatch(selectCharacter({character}));
    }
}
