import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {DeadDropContact, Message} from '../modules/chat.entities';

// @ts-ignore
import { Observable } from 'rxjs';
import { Store } from '../modules/store';
import { Router } from '@angular/router';
import { DeadDropController } from '../modules/dead-drop.module';

declare const window: any;

// @ts-ignore
@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})
export class DeadDropComponent implements OnInit {

  public selectedContact: DeadDropContact|undefined = undefined

  private deadDropController: DeadDropController;

  constructor(private store: Store, private cdr: ChangeDetectorRef, private router: Router) {
    this.deadDropController = new DeadDropController(this.store.getCurrentAccountAddressValue(), cdr)
  }

  async ngOnInit(): Promise<void> {
    // this.loadContacts()
    this.store.getCurrentAccountAddress().subscribe(_ => {
      this.selectedContact = undefined
      this.deadDropController.destroy()
      this.deadDropController = new DeadDropController(this.store.getCurrentAccountAddressValue(), this.cdr)
    })

    this.testMessages()
  }

  ngOnDestroy(): void {
    this.deadDropController.destroy();
  }

  async testMessages(): Promise<void> {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (this.selectedContact != undefined) {
        this.selectedContact.addMessage(new Message(this.selectedContact.getAddress(), new Date(), "Mensaje de prueba"))
        console.log('From Other')

        await new Promise(resolve => setTimeout(resolve, 1000));

        this.selectedContact.addMessage(new Message(this.store.getCurrentAccountAddressValue(), new Date(), "Contestación de prueba"))
        console.log('From Me')
      }
    }
  }

  sendMessage(message: any): void {
    if (this.selectedContact == undefined)
      throw 'Cannot send message to undefined. You need to pick a contact first.'

    this.deadDropController.sendMessage(this.selectedContact, message);
  }

  // Create a new chat
  async newChat($event: any, address: any): Promise<void> {
    $event.preventDefault()
    this.deadDropController.newChat(address)
  }

  getAddresses(): string[] {
    let addresses: string[] = []
    for (let contact of this.deadDropController.getContacts()) {
      addresses.push(contact.getAddress())
    }
    return addresses
  }

  async setSelectedContact(address: string): Promise<void> {
    this.selectedContact = this.getContact(address)
    this.deadDropController.subscribeToSendMessage(address)
    this.cdr.detectChanges();
  }

  getSelectedAddress(): string {
    return this.selectedContact?.getAddress() ?? ''
  }

  getMessagesSelected(): Observable<Message[]> {
    if (this.selectedContact == undefined)
      throw 'Cannot get messages: contact is undefined'

    return this.selectedContact.getMessages()
  }

  onNewChat(): void {
    this.selectedContact = undefined
  }

  isCreatingChat(): boolean {
    return this.selectedContact == undefined
  }

  private getContact(address: string): DeadDropContact|undefined {
    for (let contact of this.deadDropController.getContacts()) {
      if (contact.getAddress() == address)
        return contact
    }
    return undefined
  }
}
