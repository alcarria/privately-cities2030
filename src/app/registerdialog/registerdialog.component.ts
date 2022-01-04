import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '../modules/store';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {environment} from "../../environments/environment";
// @ts-ignore
import Contact from "../../assets/contracts/Contact.json";

declare let window: any

@Component({
  selector: 'app-registerdialog',
  templateUrl: './registerdialog.component.html',
  styleUrls: ['./registerdialog.component.css']
})
export class RegisterdialogComponent implements OnInit {

  @Output() onInviteForm = new EventEmitter<NgForm>();
  nickname: string = "";
  
  private contactContract = new window.web3.eth.Contract(
    Contact.abi,
    environment.contact_address
  )

  constructor(public store: Store, public dialogRef: MatDialogRef<RegisterdialogComponent>, public dialog: MatDialog, public ngZone: NgZone) {

  }

  ngOnInit() {
    
  }

  onCancel() {
    this.ngZone.run(() => {
      this.dialogRef.close()
    })
  }

  async onSubmit() {
    // Create account in contract Contact
    let publicKey = await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [this.store.getCurrentAccountAddressValue()]
    })

    this.contactContract.methods.setContactInfo(this.nickname, publicKey).send({from: this.store.getCurrentAccountAddressValue()})
    .then(() => {
      //Cuando se ha añadido su clave publica al contrato se sigue adelante en el proceso de login
      this.ngZone.run(() => {
        this.dialogRef.close(true)
      })
    })

    
  }

}
