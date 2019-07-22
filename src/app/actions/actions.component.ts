import {Component} from '@angular/core';
import {State, Store} from '@ngrx/store';
import {AppState} from '../store/app.state';
import {collapseArena} from '../store/actions/arena.actions';
import {ArenaService} from '../services/arena.service';
import {ActionType, Character} from '../store/models/character.model';
import {attackCharacter, moveCharacter} from '../store/actions/characters.actions';
import {CharacterService} from '../services/character.service';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

    public actionType = ActionType;

    constructor(private store: Store<AppState>,
                private state: State<AppState>,
                private arenaService: ArenaService,
                private characterService: CharacterService) {
    }

    public collapse(): void {
        const collapsedArena = this.arenaService.collapseArena(this.state.getValue().arena);
        this.store.dispatch(collapseArena({collapsedArena}));
    }

    public reset(): void {
        document.location.reload();
    }

    public hasAction(actionType: ActionType): boolean {
        const selectedCharacter = this.state.getValue().selectedCharacter;
        if (selectedCharacter) {
            return selectedCharacter.availableActions.some(action => action.type === actionType);
        }
        return false;
    }

    public executeAction(actionType: ActionType) {
        const selectedCharacter: Character = this.state.getValue().selectedCharacter;
        const characters: Character[] = this.state.getValue().characters;
        const action = selectedCharacter.availableActions.find(a => a.type === actionType);

        if ([ActionType.MOVE_UP,
            ActionType.MOVE_RIGHT,
            ActionType.MOVE_BOTTOM,
            ActionType.MOVE_LEFT,
        ].includes(actionType)) {
            this.store.dispatch(moveCharacter({
                character: selectedCharacter,
                destination: action.target,
            }));
        }

        if ([
            ActionType.ATTACK_UP,
            ActionType.ATTACK_RIGHT,
            ActionType.ATTACK_BOTTOM,
            ActionType.ATTACK_LEFT,
        ].includes(actionType)) {
            this.store.dispatch(attackCharacter({
                attacker: selectedCharacter,
                target: this.characterService.getPositionCharacter(action.target, characters),
            }));
        }

    }
}
