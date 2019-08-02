import {Component, HostListener} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {ArenaService} from '../services/arena.service';
import {ActionType} from '../store/models/character.model';
import {attackCharacter, moveCharacter} from '../store/actions/characters.actions';
import {CharacterService} from '../services/character.service';
import {GameService} from '../services/game.service';
import {first, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {AppState, charactersSelector, selectedCharacterSelector} from '../store/app.state';

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {

    public actionType = ActionType;

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
                private characterService: CharacterService,
                private gameService: GameService) {
    }

    public reset(): void {
        if (confirm('Êtes-vous sûrs de vouloir recommencer la partie ?')) {
            document.location.reload();
        }
    }

    public hasAction(actionType: ActionType): Observable<boolean> {
        return this.store.pipe(
            select(selectedCharacterSelector),
            first(),
            map(selectedCharacter => {
                if (selectedCharacter) {
                    return selectedCharacter.availableActions.some(action => action.type === actionType);
                }
                return false;
            })
        );
    }

    public executeAction(actionType: ActionType) {
        // TODO: le forkJoin fonctionne ???
        forkJoin([
            this.store.select(selectedCharacterSelector),
            this.store.select(charactersSelector),
        ]).pipe(
            first(),
        ).subscribe(([selectedCharacter, characters]) => {
            debugger;
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
        });
    }

    public validateActions() {
        this.gameService.goToTheNextRound();
    }

    private executeAvailableAction(actions: ActionType[]) {
        // FIXME: update...
        // const actionToExecute = actions.find(action => this.hasAction(action));
        // if (actionToExecute !== undefined) {
        //     this.executeAction(actionToExecute);
        // }
    }

}
