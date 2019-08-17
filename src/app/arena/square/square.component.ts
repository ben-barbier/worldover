import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, charactersSelector, selectedCharacterSelector} from '../../store/app.state';
import {Square, SquareState, SquareStyle} from '../../store/models/square.model';
import {ActionType, ActionTypeCategory, Character} from '../../store/models/character.model';
import {Position} from '../../store/models/position.model';
import {filter, flatMap, map, tap} from 'rxjs/operators';
import {CharacterService} from '../../services/character.service';

@Component({
    selector: 'app-square',
    templateUrl: './square.component.html',
    styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit, AfterViewInit {

    private readonly tilesUrl = 'assets/arena/arena-tiles.png';
    private readonly tilesWidthInPx = 32;
    private readonly tilesHeightInPx = 32;
    private readonly arenaTilesCoordinates: Map<SquareStyle, { x: number, y: number }> = (() => {
        return new Map([
            [SquareStyle.TOP_LEFT_CORNER, {x: 8 * 32, y: 10 * 32}],
            [SquareStyle.TOP_CENTER, {x: 6 * 32, y: 0}],
            [SquareStyle.TOP_RIGHT_CORNER, {x: 9 * 32, y: 10 * 32}],
            [SquareStyle.MIDDLE_LEFT, {x: 5 * 32, y: 32}],
            [SquareStyle.MIDDLE_CENTER, {x: 6 * 32, y: 32}],
            [SquareStyle.MIDDLE_RIGHT, {x: 7 * 32, y: 32}],
            [SquareStyle.BOTTOM_LEFT_CORNER, {x: 8 * 32, y: 11 * 32}],
            [SquareStyle.BOTTOM_CENTER, {x: 6 * 32, y: 2 * 32}],
            [SquareStyle.BOTTOM_RIGHT_CORNER, {x: 9 * 32, y: 11 * 32}],
            [SquareStyle.EMPTY, {x: 10 * 32, y: 11 * 32}],
            [SquareStyle.SINGLE, {x: 7 * 32, y: 8 * 32}],
        ]);
    })();
    private readonly weakenTilesCoordinates: Map<SquareStyle, { x: number, y: number }> = (() => {
        return new Map([
            [SquareStyle.TOP_LEFT_CORNER, {x: 32 * 32, y: 11 * 32}],
            [SquareStyle.TOP_CENTER, {x: 33 * 32, y: 11 * 32}],
            [SquareStyle.TOP_RIGHT_CORNER, {x: 34 * 32, y: 11 * 32}],
            [SquareStyle.MIDDLE_LEFT, {x: 32 * 32, y: 12 * 32}],
            [SquareStyle.MIDDLE_RIGHT, {x: 34 * 32, y: 12 * 32}],
            [SquareStyle.BOTTOM_LEFT_CORNER, {x: 32 * 32, y: 13 * 32}],
            [SquareStyle.BOTTOM_CENTER, {x: 33 * 32, y: 13 * 32}],
            [SquareStyle.BOTTOM_RIGHT_CORNER, {x: 34 * 32, y: 13 * 32}],
        ]);
    })();

    @Input()
    public square: Square;

    public character: Character;

    public state = SquareState;

    public actionTypes = ActionType;

    public availableAction: ActionType;

    @ViewChild('canvasElement', {static: false})
    canvas: ElementRef;

    private selectedCharacter: Character;

    constructor(private store: Store<AppState>,
                private characterService: CharacterService) {
    }

    ngOnInit(): void {
        this.store.select(charactersSelector).subscribe((characters: Character[]) => {
            this.character = characters.find(
                character => (character.healthPoints > 0) && Position.equals(character.position, this.square.position)
            );
        });
        this.store.select(selectedCharacterSelector).pipe(
            tap(selectedCharacter => this.selectedCharacter = selectedCharacter),
            tap(() => this.availableAction = null),
            map(selectedCharacter => selectedCharacter.availableActions),
            flatMap(e => e),
            filter(action => Position.equals(action.target, this.square.position)),
            map(action => action.type)
        ).subscribe(availableAction => {
            this.availableAction = availableAction;
        });
    }

    ngAfterViewInit(): void {
        this.updateBackground();
    }

    private updateBackground() {
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        const tiles = new Image();
        tiles.src = this.tilesUrl;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // turn off image aliasing
        tiles.onload = () => {
            canvas.setAttribute('width', `${this.tilesWidthInPx}px`);
            canvas.setAttribute('height', `${this.tilesHeightInPx}px`);
            ctx.clearRect(0, 0, this.tilesWidthInPx, this.tilesHeightInPx);
            ctx.drawImage(tiles,
                this.arenaTilesCoordinates.get(this.square.style).x, this.arenaTilesCoordinates.get(this.square.style).y,
                this.tilesWidthInPx, this.tilesHeightInPx,
                0, 0,   // Place the result at 0, 0 in the canvas,
                this.tilesWidthInPx, this.tilesHeightInPx // With as width / height: 32 * 32 (scale)
            );
            if (this.square.state === SquareState.WEAKENED) {
                ctx.drawImage(tiles,
                    this.weakenTilesCoordinates.get(this.square.style).x, this.weakenTilesCoordinates.get(this.square.style).y,
                    this.tilesWidthInPx, this.tilesHeightInPx,
                    0, 0,   // Place the result at 0, 0 in the canvas,
                    this.tilesWidthInPx, this.tilesHeightInPx // With as width / height: 32 * 32 (scale)
                );
            }
        };
    }

    public executeAction(actionType: ActionType): void {
        if (ActionTypeCategory.MOVE.includes(actionType)) {
            this.characterService.move(actionType, this.selectedCharacter, this.square.position);
        }
        if (ActionTypeCategory.ATTACK.includes(actionType)) {
            this.characterService.attack(actionType, this.selectedCharacter, this.character);
        }
    }

}
