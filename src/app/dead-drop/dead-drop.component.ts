import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {Contact, DeadDropContact, MessageDeadDrop} from '../modules/chat.entities';

// @ts-ignore
import {Observable} from 'rxjs';
import {Store} from '../modules/store';
import {Router} from '@angular/router';
import {DeadDropController} from '../modules/dead-drop.module';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NewchatdialogComponent} from "../newchatdialog/newchatdialog.component";

declare const window: any;

@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})

export class DeadDropComponent implements OnInit {

  public selectedContact: DeadDropContact | undefined = undefined
  private deadDropController: DeadDropController;

  constructor(private store: Store, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog) {
    this.deadDropController = new DeadDropController(this.store.getCurrentAccountValue().address, this.store.getCurrentAccountValue().publicKey, cdr)
  }

  async ngOnInit(): Promise<void> {
    // this.loadContacts()
    this.store.getCurrentAccount().subscribe(_ => {
      this.selectedContact = undefined
      this.deadDropController.destroy()
      this.deadDropController = new DeadDropController(this.store.getCurrentAccountValue().address, this.store.getCurrentAccountValue().publicKey, this.cdr)
    })
  }

  ngOnDestroy(): void {
    this.deadDropController.destroy();
  }

  async sendMessage(message: any): Promise<void> {
    if (this.selectedContact == undefined)
      throw 'Cannot send message to undefined. You need to pick a contact first.'

    await this.deadDropController.sendMessage(this.selectedContact, message);
  }

  // Create a new chat
  async newChat($event: any, address: any): Promise<void> {
    $event.preventDefault()
    await this.deadDropController.newChat(address)
  }

  getCardsInfo(): any[] {
    let addresses: any[] = []
    for (let contact of this.deadDropController.getContacts()) {
      addresses.push({
        title: contact.getNickname(),
        data: contact.getAddress()
      })
    }
    return addresses
  }

  async setSelectedContact(address: string): Promise<void> {
    this.selectedContact = this.searchContact(address)
    if (!this.deadDropController.isSubscribed(address))
      this.deadDropController.subscribeToSendMessage(address)
    this.cdr.detectChanges();
  }

  getSelectedAddress(): string {
    return this.selectedContact?.getAddress() ?? ''
  }

  getMessagesSelected(): Observable<MessageDeadDrop[]> {
    if (this.selectedContact == undefined)
      throw 'Cannot get messages: contact is undefined'
    console.log('getMessagesSelected: ' + this.selectedContact.getAddress())

    return this.selectedContact.getMessages()
  }

  onNewChat(): void {
    this.selectedContact = undefined

    const dialogConf = new MatDialogConfig()
    dialogConf.disableClose = false;
    const dialogRef = this.dialog.open(NewchatdialogComponent, dialogConf);
    dialogRef.afterClosed().subscribe(async address => {
      if (address == undefined)
        return
      await this.deadDropController.newChat(address)
    });
  }

  isCreatingChat(): boolean {
    return this.selectedContact == undefined
  }

  searchContact(address: string): DeadDropContact {
    for (let contact of this.deadDropController.getContacts()) {
      if (contact.getAddress() == address)
        return contact
    }
    throw "Contact does not exist"
  }
}
