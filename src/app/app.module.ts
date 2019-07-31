import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ArenaComponent} from './arena/arena.component';
import {SquareComponent} from './arena/square/square.component';
import {CharacterComponent} from './arena/character/character.component';
import {StoreModule} from '@ngrx/store';
import * as fromArea from './store/reducers/arena.reducer';
import * as fromCharacters from './store/reducers/characters.reducer';
import * as fromSelectedCharacter from './store/reducers/selected-character.reducer';
import {HealthPointsComponent} from './arena/character/health-points/health-points.component';
import {ActionsComponent} from './actions/actions.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {CharactersEffects} from './store/effects/characters.effects';
import { CharacterStatusComponent } from './character-status/character-status.component';

@NgModule({
    declarations: [
        AppComponent,
        ArenaComponent,
        SquareComponent,
        CharacterComponent,
        HealthPointsComponent,
        ActionsComponent,
        CharacterStatusComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatGridListModule,
        StoreModule.forRoot({
            arena: fromArea.reducer,
            characters: fromCharacters.reducer,
            selectedCharacter: fromSelectedCharacter.reducer,
        }, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true
            },
        }),
        EffectsModule.forRoot([
            CharactersEffects
        ]),
        StoreDevtoolsModule.instrument({
            maxAge: 10
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
