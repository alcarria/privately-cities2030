import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-newgroupdialog',
  templateUrl: './newgroupdialog.component.html',
  styleUrls: ['./newgroupdialog.component.css']
})
export class NewgroupdialogComponent {

  @Output() onInviteForm = new EventEmitter<NgForm>();
  name: any;

  constructor(public dialogRef: MatDialogRef<NewgroupdialogComponent>, public dialog: MatDialog, public ngZone: NgZone) {

  }

  onCancel() {
    this.ngZone.run(() => {
      this.dialogRef.close()
    })
  }

  onsubmit() {
    this.ngZone.run(() => {
      this.dialogRef.close(this.name)
    })
  }
}



