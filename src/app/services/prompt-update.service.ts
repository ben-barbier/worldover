import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class PromptUpdateService {

    constructor(updates: SwUpdate) {
        updates.available.subscribe(event => {
            if (confirm(`Une nouvelle version de Worldover est disponible, souhaitez-vous l'utiliser ?`)) {
                updates.activateUpdate().then(() => document.location.reload());
            }
        });
    }

}
