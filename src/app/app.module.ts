import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ArenaComponent} from './arena/arena.component';
import {SquareComponent} from './arena/square/square.component';
import {CharacterComponent} from './arena/character/character.component';
import {StoreModule} from '@ngrx/store';
import * as fromArena from './store/reducers/arena.reducer';
import * as fromCharacters from './store/reducers/characters.reducer';
import * as fromSelectedCharacter from './store/reducers/selected-character.reducer';
import * as fromGame from './store/reducers/game.reducer';
import {HealthPointsComponent} from './arena/character/health-points/health-points.component';
import {ActionsComponent} from './actions/actions.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {EffectsModule} from '@ngrx/effects';
import {CharactersEffects} from './store/effects/characters.effects';
import {CharacterStatusComponent} from './character-status/character-status.component';
import {ArenaEffects} from './store/effects/arena.effects';
import {GameStatusComponent} from './game-status/game-status.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material';
import {WinComponent} from './dialogs/result/win/win.component';
import {ExaequoComponent} from './dialogs/result/exaequo/exaequo.component';

@NgModule({
    declarations: [
        AppComponent,
        ArenaComponent,
        SquareComponent,
        CharacterComponent,
        HealthPointsComponent,
        ActionsComponent,
        CharacterStatusComponent,
        GameStatusComponent,
        WinComponent,
        ExaequoComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatGridListModule,
        MatDialogModule,
        StoreModule.forRoot({
            arena: fromArena.reducer,
            characters: fromCharacters.reducer,
            selectedCharacter: fromSelectedCharacter.reducer,
            game: fromGame.reducer,
        }, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true
            },
        }),
        EffectsModule.forRoot([
            CharactersEffects,
            ArenaEffects,
        ]),
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        // FIXME: https://github.com/ngrx/platform/issues/1054 (Effect gets called twice when using StoreDevtoolsModule.instrument())
        // FIXME: Solution => do not use ☠State<AppState>☠ in application ️
        // StoreDevtoolsModule.instrument({
        //     maxAge: 10
        // }),
    ],
    providers: [
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {disableClose: true, hasBackdrop: true}}
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ExaequoComponent,
        WinComponent,
    ]
})
export class AppModule {
}
