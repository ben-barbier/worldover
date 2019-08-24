import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { InstanceService } from './instance.service';
import { Arena } from '../store/models/arena.model';
import { Game } from '../store/models/game.model';
import { Character } from '../store/models/character.model';
import { AppState, arenaSelector, charactersSelector, gameSelector } from '../store/app.state';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    private arena: Arena;
    private game: Game;
    private characters: Character[];

    constructor(private afs: AngularFirestore,
                private instanceService: InstanceService,
                private store: Store<AppState>) {
        this.store.select(gameSelector).subscribe(game => this.game = game);
        this.store.select(arenaSelector).subscribe(arena => this.arena = arena);
        this.store.select(charactersSelector).subscribe(characters => this.characters = characters);
    }

    public pushStateToFirebase(): Promise<any> {
        return this.instanceService.updateInstance(
            this.arena,
            this.game,
            this.characters,
        );
    }

}
