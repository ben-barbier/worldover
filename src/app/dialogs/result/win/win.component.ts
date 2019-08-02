import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Character} from '../../../store/models/character.model';

@Component({
    selector: 'app-win',
    templateUrl: './win.component.html',
    styleUrls: ['./win.component.scss']
})
export class WinComponent {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { winner: Character }) {
    }

    public reset(): void {
        document.location.reload();
    }
}
