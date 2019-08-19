import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Character, CharacterOrientation } from '../store/models/character.model';
import { BehaviorSubject } from 'rxjs';
import { config } from '../config';

@Component({
    selector: 'app-select-characters',
    templateUrl: './select-characters.component.html',
    styleUrls: ['./select-characters.component.scss']
})
export class SelectCharactersComponent {

    public charactersOnArena: number = config.charactersOnArena;

    public characters: Partial<Character>[] = [
        { name: 'Sacha', healthPointsTotal: 3, photo: 1 },
        { name: 'Alice', healthPointsTotal: 3, photo: 2 },
        { name: 'Ken', healthPointsTotal: 3, photo: 3 },
        { name: 'Diane', healthPointsTotal: 3, photo: 4 },
        { name: 'Ada', healthPointsTotal: 3, photo: 5 },
        { name: 'Mae', healthPointsTotal: 3, photo: 6 },
        { name: 'Boby', healthPointsTotal: 3, photo: 7 },
        { name: 'Arthur', healthPointsTotal: 3, photo: 8 },
    ];

    public selectedCharacters$ = new BehaviorSubject<number>(this.charactersOnArena);

    constructor(private dialogRef: MatDialogRef<SelectCharactersComponent>) {
        this.characters = this.characters.map((character, idx) => {
            if (idx < this.charactersOnArena) {
                return { ...character, selected: true };
            }
            return character;
        });
    }

    public selectCharacter(character: { selected?: boolean }): void {
        if (character.selected) {
            this.selectedCharacters$.next(this.selectedCharacters$.getValue() - 1);
        } else {
            this.selectedCharacters$.next(this.selectedCharacters$.getValue() + 1);
        }
        character.selected = !character.selected;
    }

    public validate(): void {
        this.dialogRef.close(this.characters
            .filter(character => !!character.selected)
            .map(character => ({
                ...character,
                availableActions: [],
                orientation: CharacterOrientation.BOTTOM,
                healthPoints: character.healthPointsTotal,
                actionPoints: character.healthPointsTotal,
                selected: false
            })),
        );
    }

}
