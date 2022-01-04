import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '../modules/store';
import { RegisterdialogComponent } from '../registerdialog/registerdialog.component';

declare let window: any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, private router: Router, private store: Store) { }

  ngOnInit(): void {
  }

  async crearCuenta(): Promise<void> {
    await window.ethereum.request({method: 'eth_requestAccounts'})

    const dialogConf = new MatDialogConfig()

    dialogConf.disableClose = false;

    const dialogRef = this.dialog.open(RegisterdialogComponent, dialogConf);

    dialogRef.afterClosed().subscribe(async data => {
      console.log(await this.store.getCurrentAccountPublicKey())
      if (data == true)
        this.router.navigate(['dead-drop'])
    });
  }

}
