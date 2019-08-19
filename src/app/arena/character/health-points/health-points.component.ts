import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-health-points',
    templateUrl: './health-points.component.html',
    styleUrls: ['./health-points.component.scss']
})
export class HealthPointsComponent implements OnChanges {

    @Input()
    public healthPoints: number;

    @Input()
    public healthPointsTotal: number;

    public damages = 0;

    ngOnChanges(changes: SimpleChanges): void {
        this.damages = this.healthPointsTotal - this.healthPoints;
    }

}
