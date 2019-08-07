import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, charactersSelector, selectedCharacterSelector} from '../../store/app.state';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
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

    public selected$: Observable<boolean>;

    public character: Character;

    public state = SquareState;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.selected$ = this.store.pipe(
            select(selectedCharacterSelector),
            filter(c => !!c),
            map((selectedCharacter: Character): boolean => Position.equals(selectedCharacter.position, this.square.position)),
        );

        this.store.pipe(
            select(charactersSelector),
        ).subscribe((characters: Character[]) => {
            const characterOnSquare = characters.find(character => Position.equals(character.position, this.square.position));
            this.character = characterOnSquare ? characterOnSquare : null;
        });
    }

}
