import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Character, CharacterOrientation} from '../../store/models/character.model';
import {AppState} from '../../store/app.state';
import {Store} from '@ngrx/store';
import {selectCharacter} from '../../store/actions/characters.actions';
import {interval} from 'rxjs';

interface FrameCoordinates {
    sx: number;
    sy: number;
    width: number;
    height: number;
}

@Component({
    selector: 'app-character',
    templateUrl: './character.component.html',
    styleUrls: ['./character.component.scss']
})
export class CharacterComponent {

    private readonly spritesUrl = 'assets/characters/bodies/characters-bodies.png';
    private readonly framesByRow = 12;
    private readonly framesByColumn = 8;
    private readonly charactersByRow = 4;
    private readonly frames = [1, 2, 1, 0];
    private readonly defaultFrame = 1;

    private frame: number = this.defaultFrame;

    @Input()
    public character: Character;

    constructor(private store: Store<AppState>) {
    }

    @ViewChild('canvasElement', {static: false})
    set canvas(canvasElement: ElementRef) {
        const canvas: HTMLCanvasElement = canvasElement.nativeElement;
        const sprites = new Image();
        sprites.src = this.spritesUrl;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // turn off image aliasing
        sprites.onload = () => {
            const frameWidth = sprites.width / this.framesByRow;
            const frameHeight = sprites.height / this.framesByColumn;
            canvas.setAttribute('width', `${frameWidth}px`);
            canvas.setAttribute('height', `${frameHeight}px`);
            const defaultFrameCoordinates = this.getFrameTopLeftCoordinates(
                this.character.photo, this.defaultFrame, this.character.orientation, frameWidth, frameHeight, this.charactersByRow);
            this.displayFrame(ctx, sprites, defaultFrameCoordinates);

            interval(300).subscribe(i => {
                if (this.character.selected) {
                    this.frame = this.getNextFrame(i, this.frames);
                    const frameCoordinates = this.getFrameTopLeftCoordinates(
                        this.character.photo, this.frame, this.character.orientation, frameWidth, frameHeight, this.charactersByRow);
                    this.displayFrame(ctx, sprites, frameCoordinates);
                } else if (this.frame !== this.defaultFrame) {
                    this.frame = this.defaultFrame;
                    this.displayFrame(ctx, sprites, defaultFrameCoordinates);
                }
            });
        };
    }

    private displayFrame(canvasCtx, sprites, frameCoordinates: FrameCoordinates) {
        canvasCtx.clearRect(0, 0, frameCoordinates.width, frameCoordinates.height);
        canvasCtx.drawImage(sprites,
            frameCoordinates.sx, frameCoordinates.sy,
            frameCoordinates.width, frameCoordinates.height,
            0, 0,   // Place the result at 0, 0 in the canvas,
            frameCoordinates.width, frameCoordinates.height // With as width / height: 32 * 32 (scale)
        );
    }

    private getFrameTopLeftCoordinates(character: number, frame: number, orientation: CharacterOrientation,
                                       frameWidth: number, frameHeight: number,
                                       charactersByRow: number): FrameCoordinates {
        return {
            sx: (frameWidth * frame) + ((character % charactersByRow) - 1) * 3 * frameWidth,
            sy: (Math.floor(character / charactersByRow) * charactersByRow * frameHeight) + (orientation * frameHeight),
            width: frameWidth,
            height: frameHeight,
        };
    }

    private getNextFrame(i: number, frames: number[]): number {
        return frames[i % frames.length];
    }

    public selectCharacter(character: Character) {
        this.store.dispatch(selectCharacter({character}));
    }

}
