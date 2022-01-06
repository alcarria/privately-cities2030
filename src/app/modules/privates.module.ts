import {PrivateContact, Message, Contact} from "./chat.entities";

import {environment} from "src/environments/environment";
import {ChangeDetectorRef} from "@angular/core";
import {decrypt, encrypt} from "./encryption.module";
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';
// @ts-ignore
import PrivateContract from '../../assets/contracts/Privates.json'


declare let window: any;

export class PrivateController {

  private contract: any;

  private contacts: PrivateContact[] = [];
  private onInviteSubscriber: any;

  private sendMessageSubscriptions: Map<string, any> = new Map<string, any>()

  constructor(private currentAddress: string, private currentPublicKey: string, private cdr: ChangeDetectorRef) {
    this.contract = new window.web3.eth.Contract(
      PrivateContract.abi,
      environment.privates_address
    )

    // Get list of my groups
    this.onInviteSubscriber = this.contract.events.onShareKey({
      fromBlock: 0
    }, (error: any, event: any) => this.onShareKey(error, event))
  }

  destroy() {
    // Unsubscribe contact messages
    for (const contact of this.contacts) {
      contact.unsubscribe();
    }

    // Unsubscribe ShareSeed event
    if (this.onInviteSubscriber != undefined) {
      this.onInviteSubscriber.unsubscribe()
    }
  }

  // Cuando llega una invitacion hay que aceptarla
  private async onShareKey(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    if (event.returnValues.to.toLowerCase() == this.currentAddress.toLowerCase()) {
      const from = String(event.returnValues.from)
      const contactKey = event.returnValues.toContactKey
      this.contacts.push(await PrivateContact.create(from, contactKey))
    } else if (event.returnValues.from.toLowerCase() == this.currentAddress.toLowerCase()) {
      const to = String(event.returnValues.to)
      const contactKey = event.returnValues.fromContactKey
      this.contacts.push(await PrivateContact.create(to, contactKey))
    }
    this.cdr.detectChanges();
  }

  async sendMessage(selectedContact: PrivateContact, message: any): Promise<void> {
    const contactKey: string = await selectedContact.getDecryptedKey()
    let encryptedMessage = encrypt(message, contactKey, 'xsalsa20-poly1305')
    await this.contract.methods.sendMessage(selectedContact.getAddress(), encryptedMessage).send({from: this.currentAddress})
  }

  isSubscribed(contactAddress: string): boolean {
    return this.sendMessageSubscriptions.has(contactAddress)
  }

  async subscribeToSendMessage(contactAddress: string): Promise<void> {
    console.log('contactAddress: ' + contactAddress)
    if (this.isSubscribed(contactAddress))
      this.sendMessageSubscriptions.get(contactAddress).unsubscribe();

    await this.getContact(contactAddress)?.getDecryptedKey()

    this.sendMessageSubscriptions.set(
      contactAddress,
      this.contract.events.onMessage({
        // filter: {'from': contactAddress.toLowerCase(), 'to': this.currentAddress.toLowerCase()},
        fromBlock: 0
      }, (error: any, event: any) => this.onMessageEvent(error, event)),
    )
  }

  private async onMessageEvent(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    if (!this.isTheMessageForMe(event))
      return

    let from = event.returnValues.from
    let contactKey;
    let contact;

    if (from.toLowerCase() == this.currentAddress.toLowerCase()) {
      contactKey = await this.getContact(String(event.returnValues.to))?.getDecryptedKey()
    } else {
      contactKey = await this.getContact(event.returnValues.from)?.getDecryptedKey()
    }

    if (contactKey == undefined)
      throw "Public key is undefined. Cant decrypt the message"

    let message = await decrypt(event.returnValues.message, contactKey, 'xsalsa20-poly1305')

    if (from.toLowerCase() == this.currentAddress.toLowerCase())
      contact = this.getContact(event.returnValues.to)
    else
      contact = this.getContact(event.returnValues.from)

    if (contact == undefined)
      throw 'contact is undefined'

    contact.addMessage(new Message(from, new Date(Number(event.returnValues.timestamp)), message))
    this.cdr.detectChanges();
  }

  private isTheMessageForMe(event: any): boolean {
    const contact = String(event.returnValues.to)
    if (this.getContact(contact) != undefined) {
      return event.returnValues.from.toLowerCase() == this.currentAddress.toLowerCase()

    } else if (event.returnValues.to.toLowerCase() == this.currentAddress) {
      return this.getContact(String(event.returnValues.from)) != undefined

    } else {
      return false
    }
  }

  getContacts(): PrivateContact[] {
    return this.contacts
  }

  // Create a new chat
  async newChat(address: any): Promise<void> {
    const contactAddress = address.value

    const destPublicKey = (await Contact.getContactInfo(contactAddress)).publicKey

    const decrytedKey = naclUtil.encodeBase64(nacl.randomBytes(32));
    const myCypherKey = encrypt(decrytedKey, this.currentPublicKey, 'x25519-xsalsa20-poly1305')
    const destCypherKey = encrypt(decrytedKey, destPublicKey, 'x25519-xsalsa20-poly1305')

    await this.contract.methods.shareKey(contactAddress, myCypherKey, destCypherKey).send({from: this.currentAddress})
  }

  getContact(address: string): PrivateContact {
    for (let contact of this.contacts) {
      if (contact.getAddress().toLowerCase() == address.toLowerCase())
        return contact
    }
    throw 'Contact does not exist'
  }
}
