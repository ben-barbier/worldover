import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArenaComponent } from './arena/arena.component';
import { SquareComponent } from './arena/square/square.component';
import { CharacterComponent } from './arena/character/character.component';
import { StoreModule } from '@ngrx/store';
import * as fromArena from './store/reducers/arena.reducer';
import * as fromCharacters from './store/reducers/characters.reducer';
import * as fromGame from './store/reducers/game.reducer';
import { HealthPointsComponent } from './arena/character/health-points/health-points.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { EffectsModule } from '@ngrx/effects';
import { CharacterStatusComponent } from './character-status/character-status.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WinComponent } from './dialogs/result/win/win.component';
import { ExaequoComponent } from './dialogs/result/exaequo/exaequo.component';
import { KeyboardManagerDirective } from './directives/keyboard-manager.directive';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SelectCharactersComponent } from './select-characters/select-characters.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SelectInstanceComponent } from './select-instance/select-instance.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseEffects } from './store/effects/firebase.effects';

@NgModule({
    declarations: [
        AppComponent,
        ArenaComponent,
        SquareComponent,
        CharacterComponent,
        HealthPointsComponent,
        CharacterStatusComponent,
        TimelineComponent,
        WinComponent,
        ExaequoComponent,
        KeyboardManagerDirective,
        SelectCharactersComponent,
        SelectInstanceComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatGridListModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        StoreModule.forRoot({
            arena: fromArena.reducer,
            characters: fromCharacters.reducer,
            game: fromGame.reducer,
        }, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true
            },
        }),
        EffectsModule.forRoot([
            FirebaseEffects,
        ]),
        StoreDevtoolsModule.instrument({
            maxAge: 10
        }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        AngularFireModule.initializeApp(environment.firebase, 'worldover'),
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        // AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        // AngularFireStorageModule // imports firebase/storage only needed for storage features
    ],
    providers: [
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { disableClose: true, hasBackdrop: true } }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ExaequoComponent,
        WinComponent,
        SelectCharactersComponent,
        SelectInstanceComponent,
    ]
})
export class AppModule {
}
