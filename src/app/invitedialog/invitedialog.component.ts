import {Component, EventEmitter, NgZone, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-invitedialog',
  templateUrl: 'invitedialog.component.html',
})

export class InvitedialogComponent {
  @Output() onInviteForm = new EventEmitter<NgForm>();
  address: any;

  constructor(public dialogRef: MatDialogRef<InvitedialogComponent>, public dialog: MatDialog, public ngZone: NgZone) {

  }

  onCancel() {
    this.ngZone.run(() => {
      this.dialogRef.close()
    })
  }

  onsubmit() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.address)
    })
  }
}

