import {Directive, HostListener} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState, charactersSelector, selectedCharacterSelector} from '../store/app.state';
import {ArenaService} from '../services/arena.service';
import {ActionType, ActionTypeCategory, Character} from '../store/models/character.model';
import {CharacterService} from '../services/character.service';

@Directive({
    selector: '[appKeyboardManager]',
})
export class KeyboardManagerDirective {

    private characters: Character[];
    private selectedCharacter: Character;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowUp') {
            this.executeAvailableAction([ActionType.MOVE_UP, ActionType.ATTACK_UP]);
        } else if (event.key === 'ArrowRight') {
            this.executeAvailableAction([ActionType.MOVE_RIGHT, ActionType.ATTACK_RIGHT]);
        } else if (event.key === 'ArrowDown') {
            this.executeAvailableAction([ActionType.MOVE_BOTTOM, ActionType.ATTACK_BOTTOM]);
        } else if (event.key === 'ArrowLeft') {
            this.executeAvailableAction([ActionType.MOVE_LEFT, ActionType.ATTACK_LEFT]);
        }
    }

    constructor(private store: Store<AppState>,
                private arenaService: ArenaService,
                private characterService: CharacterService) {
        store.select(selectedCharacterSelector).subscribe(selectedCharacter =>
            this.selectedCharacter = selectedCharacter
        );
        store.select(charactersSelector).subscribe(characters => this.characters = characters);
    }

    public hasAction(actionType: ActionType): boolean {
        return this.selectedCharacter.availableActions.some(action => action.type === actionType);
    }

    public executeAction(actionType: ActionType) {
        const action = this.selectedCharacter.availableActions.find(a => a.type === actionType);

        if (ActionTypeCategory.MOVE.includes(actionType)) {
            this.characterService.move(actionType, this.selectedCharacter, action.target);
        }

        if (ActionTypeCategory.ATTACK.includes(actionType)) {
            this.characterService.attack(
                actionType, this.selectedCharacter,
                this.characterService.getPositionCharacter(action.target, this.characters));
        }
    }

    private executeAvailableAction(actions: ActionType[]) {
        const actionToExecute = actions.find(action => this.hasAction(action));
        if (actionToExecute !== undefined) {
            this.executeAction(actionToExecute);
        }
    }

}
