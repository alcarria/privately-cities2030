import {Component, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-permdialog',
  templateUrl: './permdialog.component.html',
  styleUrls: ['./permdialog.component.css']
})
export class PermdialogComponent implements OnInit {

  @Output() onInviteForm = new EventEmitter<NgForm>();
  address: any;
  permissions: any;

  constructor(public dialogRef: MatDialogRef<PermdialogComponent>, public dialog: MatDialog, public ngZone: NgZone) {

  }

  ngOnInit() {
  }

  onCancel() {
    this.ngZone.run(() => {
      this.dialogRef.close()
    })
  }

  onSubmit() {
    this.ngZone.run(() => {
      const data = {'address': this.address, 'permissions': this.permissions}
      this.dialogRef.close(data)
    })
  }

}
