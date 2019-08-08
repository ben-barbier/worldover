import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, charactersSelector} from '../../store/app.state';
import {Square, SquareState} from '../../store/models/square.model';
import {Character} from '../../store/models/character.model';
import {Position} from '../../store/models/position.model';

@Component({
    selector: 'app-square',
    templateUrl: './square.component.html',
    styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

    @Input()
    public square: Square;

    public character: Character;

    public state = SquareState;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.store.select(charactersSelector).subscribe((characters: Character[]) => {
            const characterOnSquare = characters.find(character => Position.equals(character.position, this.square.position));
            this.character = characterOnSquare ? characterOnSquare : null;
        });
    }

}
