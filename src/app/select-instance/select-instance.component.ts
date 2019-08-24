import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, mergeMap, tap } from 'rxjs/operators';
import { InstanceService } from '../services/instance.service';
import { OnlineStatusService } from '../services/online-status.service';

@Component({
    selector: 'app-select-instance',
    templateUrl: './select-instance.component.html',
    styleUrls: ['./select-instance.component.scss']
})
export class SelectInstanceComponent {

    public instanceForm: FormGroup = this.fb.group({
        instanceName: ['', [Validators.required, Validators.minLength(2)]],
    });

    public instanceExists = undefined;

    public loading = false;

    public isOnline$ = this.onlineStatusService.isOnline$;

    constructor(private dialogRef: MatDialogRef<SelectInstanceComponent>,
                private fb: FormBuilder,
                private instanceService: InstanceService,
                private onlineStatusService: OnlineStatusService) {

        this.instanceForm.get('instanceName').valueChanges.pipe(
            filter(instanceName => instanceName !== ''),
            tap(() => this.loading = true),
            tap(() => this.instanceExists = undefined),
            debounceTime(180),
            mergeMap(instanceName => this.instanceService.instanceExists(instanceName)),
            tap(() => this.loading = false),
        ).subscribe((instanceExists) => {
            this.instanceExists = instanceExists;
        });

    }

    public validate(instanceName: string, instanceExists: boolean): void {
        this.dialogRef.close({ instanceName, instanceExists });
    }

    public playOffline(): void {
        // TODO: play offline
        alert('TODO');
    }

}
