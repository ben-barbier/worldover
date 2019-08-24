import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Arena } from '../store/models/arena.model';
import { Game } from '../store/models/game.model';
import { Character } from '../store/models/character.model';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import * as CharactersActions from '../store/actions/characters.actions';
import * as ArenaActions from '../store/actions/arena.actions';
import * as GameActions from '../store/actions/game.actions';
import { CharacterService } from './character.service';

@Injectable({
    providedIn: 'root'
})
export class InstanceService {

    private doc: AngularFirestoreDocument;

    constructor(private afs: AngularFirestore,
                private characterService: CharacterService,
                private store: Store<AppState>) {
    }

    public instanceExists(instanceName: string): Promise<boolean> {
        return this.afs.collection('instances').doc(instanceName).get().toPromise().then(docData => docData.exists);
    }

    public setInstanceName(instanceName: string): void {
        this.doc = this.afs.collection('instances').doc(instanceName);
    }

    public createInstance(instanceName: string, arena: Arena, game: Game, characters: Character[]): Promise<any> {
        return Promise.all([
            this.doc.set({ instanceName }),
            this.doc.collection('arena').doc('arena').set(arena),
            this.doc.collection('game').doc('game').set(game),
            characters.forEach(character => this.doc.collection('characters').doc(character.name).set(character))
        ]);
    }

    public updateInstance(arena: Arena, game: Game, characters: Character[]): Promise<void> {
        const batch = this.afs.firestore.batch();
        characters.forEach((c) => {
            batch.set(this.doc.collection(`characters`).doc(c.name).ref, c);
        });
        batch.set(this.doc.collection(`game`).doc('game').ref, game);
        batch.set(this.doc.collection(`arena`).doc('arena').ref, arena);
        return batch.commit();
    }

    public observeInstance(instanceName: string): void {
        this.doc.collection<Arena>('arena').doc<Arena>('arena').valueChanges().subscribe(arena =>
            this.store.dispatch(ArenaActions.updateArenaFromFirebase({ updatedArena: arena }))
        );
        this.doc.collection<Game>('game').doc<Game>('game').valueChanges().subscribe(game =>
            this.store.dispatch(GameActions.updateGameFromFirebase({ updatedGame: game }))
        );
        this.doc.collection<Character>('characters').valueChanges().subscribe((characters) => {
            this.store.dispatch(CharactersActions.updateCharactersFromFirebase({ updatedCharacters: characters }));
            this.characterService.refreshSelectedCharacterAvailableActions();
        });
    }

}
