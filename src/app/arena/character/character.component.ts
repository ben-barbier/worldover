import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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

    private static readonly charactersByRow = 12;
    private static readonly charactersByColumn = 8;

    @Input()
    public character: Character;

    constructor(private store: Store<AppState>) {
    }

    @ViewChild('canvasElement', {static: false})
    set canvas(canvasElement: ElementRef) {
        const canvas: HTMLCanvasElement = canvasElement.nativeElement;
        const image = new Image();
        image.src = 'assets/characters/bodies/characters-bodies.png';
        const ctx = canvas.getContext('2d');
        image.onload = () => {
            const characterWidth = image.width / CharacterComponent.charactersByRow;
            const characterHeight = image.height / CharacterComponent.charactersByColumn;
            canvas.setAttribute('width', `${characterWidth}px`);
            canvas.setAttribute('height', `${characterHeight}px`);
            ctx.drawImage(image,
                characterWidth + ((this.character.photo % 4) - 1) * 3 * characterWidth, // Start X (px)
                Math.floor(this.character.photo / 4) * 4 * characterHeight,   // Start Y (px)
                characterWidth, // Width (px)
                characterHeight, // Height (px)
                0, 0,   // Place the result at 0, 0 in the canvas,
                characterWidth, characterHeight // With as width / height: 32 * 32 (scale)
            );
        };
    }

    public selectCharacter(character: Character) {
        this.store.dispatch(selectCharacter({character}));
    }

}
