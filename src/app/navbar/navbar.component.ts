import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterdialogComponent } from '../registerdialog/registerdialog.component';
import { Store } from '../modules/store';
declare const window: any

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public address: string = ''
  public nickname: string = ''

  constructor(public store: Store, private cdr: ChangeDetectorRef, public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.store.getCurrentAccount().subscribe(account => {
      console.log('Address changed to ' + account?.address)
      this.address = account.address
      this.nickname = account.nickname
      this.cdr.detectChanges()
    })
  }

  async crearCuenta(): Promise<void> {
    await window.ethereum.request({method: 'eth_requestAccounts'})

    const dialogConf = new MatDialogConfig()

    dialogConf.disableClose = false;

    const dialogRef = this.dialog.open(RegisterdialogComponent, dialogConf);
  }
}
