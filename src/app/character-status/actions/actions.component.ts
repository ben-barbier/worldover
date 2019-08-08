import {Component, HostListener} from '@angular/core';
import {State, Store} from '@ngrx/store';
import {AppState, selectedCharacterSelector} from '../../store/app.state';
import {ArenaService} from '../../services/arena.service';
import {ActionType, Character, CharacterOrientation} from '../../store/models/character.model';
import {attackCharacter, moveCharacter} from '../../store/actions/characters.actions';
import {CharacterService} from '../../services/character.service';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

    public actionType = ActionType;

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
                private state: State<AppState>,
                private arenaService: ArenaService,
                private characterService: CharacterService) {
        store.select(selectedCharacterSelector).subscribe(selectedCharacter =>
            this.selectedCharacter = selectedCharacter
        );
    }

    public hasAction(actionType: ActionType): boolean {
        return this.selectedCharacter.availableActions.some(action => action.type === actionType);
    }

    public executeAction(actionType: ActionType) {
        const characters: Character[] = this.state.getValue().characters;
        const action = this.selectedCharacter.availableActions.find(a => a.type === actionType);

        if ([ActionType.MOVE_UP,
            ActionType.MOVE_RIGHT,
            ActionType.MOVE_BOTTOM,
            ActionType.MOVE_LEFT,
        ].includes(actionType)) {
            this.store.dispatch(moveCharacter({
                character: this.selectedCharacter,
                destination: action.target,
                orientation: this.getOrientation(actionType),
            }));
        }

        if ([
            ActionType.ATTACK_UP,
            ActionType.ATTACK_RIGHT,
            ActionType.ATTACK_BOTTOM,
            ActionType.ATTACK_LEFT,
        ].includes(actionType)) {
            this.store.dispatch(attackCharacter({
                attacker: this.selectedCharacter,
                target: this.characterService.getPositionCharacter(action.target, characters),
                orientation: this.getOrientation(actionType),
            }));
        }
    }

    private executeAvailableAction(actions: ActionType[]) {
        const actionToExecute = actions.find(action => this.hasAction(action));
        if (actionToExecute !== undefined) {
            this.executeAction(actionToExecute);
        }
    }

    private getOrientation(actionType: ActionType): CharacterOrientation {
        return [
            {action: ActionType.MOVE_UP, orientation: CharacterOrientation.TOP},
            {action: ActionType.MOVE_RIGHT, orientation: CharacterOrientation.RIGHT},
            {action: ActionType.MOVE_BOTTOM, orientation: CharacterOrientation.BOTTOM},
            {action: ActionType.MOVE_LEFT, orientation: CharacterOrientation.LEFT},
            {action: ActionType.ATTACK_UP, orientation: CharacterOrientation.TOP},
            {action: ActionType.ATTACK_RIGHT, orientation: CharacterOrientation.RIGHT},
            {action: ActionType.ATTACK_BOTTOM, orientation: CharacterOrientation.BOTTOM},
            {action: ActionType.ATTACK_LEFT, orientation: CharacterOrientation.LEFT},
        ].find(e => e.action === actionType).orientation;
    }

}
