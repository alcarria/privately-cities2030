import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-newchatdialog',
  templateUrl: './newchatdialog.component.html',
  styleUrls: ['./newchatdialog.component.css']
})
export class NewchatdialogComponent {

  @Output() onInviteForm = new EventEmitter<NgForm>();
  address: any;

  constructor(public dialogRef: MatDialogRef<NewchatdialogComponent>, public dialog: MatDialog, public ngZone: NgZone) {

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

