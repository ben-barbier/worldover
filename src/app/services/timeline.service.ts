import {Injectable} from '@angular/core';
import {TimelineCharacter} from '../store/models/game.model';
import {Character} from '../store/models/character.model';

@Injectable({
    providedIn: 'root'
})
export class TimelineService {

    public generateTimeline(characters: Character[]): TimelineCharacter[] {
        return characters.map(c => ({
            name: c.name,
            photo: c.photo,
            alive: c.healthPoints > 0,
        }));
    }

}
