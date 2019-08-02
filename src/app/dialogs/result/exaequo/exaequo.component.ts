import {Component} from '@angular/core';

@Component({
    selector: 'app-exaequo',
    templateUrl: './exaequo.component.html',
    styleUrls: ['./exaequo.component.scss']
})
export class ExaequoComponent {

    public reset(): void {
        document.location.reload();
    }

}
