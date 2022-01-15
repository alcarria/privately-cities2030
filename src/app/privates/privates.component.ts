import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Message, PrivateContact} from "../modules/chat.entities";
import {Observable} from "rxjs";
import {Store} from "../modules/store";
import {Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PrivateController} from "../modules/privates.module";
import {NewchatdialogComponent} from "../newchatdialog/newchatdialog.component";

@Component({
  selector: 'app-privates',
  templateUrl: './privates.component.html',
  styleUrls: ['./privates.component.css']
})
export class PrivatesComponent implements OnInit {

  public selectedChat: PrivateContact | undefined = undefined
  private PrivateController: PrivateController;
  public messagesObservable: Observable<Message[]> = new Observable<Message[]>()

  /*
  0: uso normal
  1: creando chat
 */

  constructor(private store: Store, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog) {
    this.PrivateController = new PrivateController(this.store.getCurrentAccountValue().address, this.store.getCurrentAccountValue().publicKey, cdr)
  }

  ngOnInit(): void {
    this.store.getCurrentAccount().subscribe(_ => {
      this.selectedChat = undefined
      this.PrivateController.destroy()
      this.PrivateController = new PrivateController(this.store.getCurrentAccountValue().address, this.store.getCurrentAccountValue().publicKey, this.cdr)
    })
  }

  ngOnDestroy(): void {
    this.PrivateController.destroy();
  }

  async sendMessage(message: any): Promise<void> {
    if (this.selectedChat == undefined)
      throw 'Cannot send message to undefined. You need to pick a contact first.'

    await this.PrivateController.sendMessage(this.selectedChat, message);
  }

  getCardsInfo(): any[] {
    let addresses: any[] = []
    for (let contact of this.PrivateController.getContacts()) {
      addresses.push({
        title: contact.getNickname(),
        data: contact.getAddress()
      })
    }
    return addresses
  }

  async setSelectedAddress(contactAddress: string): Promise<void> {

    if (this.selectedChat?.getAddress() == contactAddress)
      return

    this.selectedChat = this.PrivateController.getContact(contactAddress);

    if (!this.PrivateController.isSubscribed(contactAddress))
      await this.PrivateController.subscribeToSendMessage(contactAddress);
    this.cdr.detectChanges();
  }

  getSelectedAddress(): string {
    return this.selectedChat?.getAddress() ?? ''
  }

  getMessagesSelected(): Observable<Message[]> {
    if (this.selectedChat == undefined)
      return new Observable()
    return this.selectedChat.getMessages()
  }

  onNewChat(): void {
    const dialogConf = new MatDialogConfig()
    dialogConf.disableClose = false;
    const dialogRef = this.dialog.open(NewchatdialogComponent, dialogConf);
    dialogRef.afterClosed().subscribe(async address => {
      if (address == undefined)
        return
      await this.PrivateController.newChat(address)
    });
  }

  searchContact(address: string): PrivateContact | undefined {
    for (let contact of this.PrivateController.getContacts()) {
      if (contact.getAddress() == address)
        return contact
    }
    return undefined
  }
}
