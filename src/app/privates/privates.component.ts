import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Message, PrivateContact} from "../modules/chat.entities";
import {Observable} from "rxjs";
import {Store} from "../modules/store";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {PrivateController} from "../modules/privates.module";

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
  private userActions = 1

  constructor(private store: Store, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog) {
    this.PrivateController = new PrivateController(this.store.getCurrentAccountValue().address, this.store.getCurrentAccountValue().publicKey, cdr)
  }

  ngOnInit(): void {
    this.store.getCurrentAccount().subscribe(_ => {
      this.selectedChat = undefined
      this.userActions = 1
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

  getAddresses(): string[] {
    let addresses: string[] = []
    for (let contact of this.PrivateController.getContacts()) {
      addresses.push(contact.getAddress())
    }
    return addresses
  }

  async setSelectedAddress(contactAddress: string): Promise<void> {

    if (this.selectedChat?.getAddress() == contactAddress)
      return

    this.selectedChat = this.PrivateController.getContact(contactAddress);

    if (!this.PrivateController.isSubscribed(contactAddress))
      await this.PrivateController.subscribeToSendMessage(contactAddress);
    this.userActions = 0
    this.cdr.detectChanges();
  }

  getSelectedAddress(): string {
    return this.selectedChat?.getAddress() ?? ''
  }

  getMessagesSelected(): any {
    if (this.selectedChat == undefined)
      throw 'Cannot get messages: contact is undefined'
    return this.selectedChat.getMessages()
  }

  onNewChat(): void {
    this.userActions = 1
    this.selectedChat = undefined
  }

  async newChat($event: any, name: any): Promise<void> {
    $event.preventDefault()
    await this.PrivateController.newChat(name)
    this.userActions = 1
  }

  get userActionStatus(): number {
    return this.userActions;
  }
}
