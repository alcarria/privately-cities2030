import {Contact, DeadDropContact, MessageDeadDrop} from "./chat.entities";

// @ts-ignore
import DeadDropContract from '../../assets/contracts/DeadDrop.json'
import {environment} from "src/environments/environment";
import {Store} from "./store";
import {ChangeDetectorRef} from "@angular/core";
import {encrypt} from "./encryption.module";
import getToken from "totp-generator";

declare let window: any;

export class DeadDropController {

  private contract: any;

  private contacts: DeadDropContact[] = [];
  private shareSeedSubscriber: any;

  private sendMessageSubscriptions: Map<string, any> = new Map<string, any>()

  constructor(private currentAddress: string, private currentPublicKey: string, private cdr: ChangeDetectorRef) {
    this.contract = new window.web3.eth.Contract(
      DeadDropContract.abi,
      environment.deaddrop_address
    )

    // Get list  of all contacts
    this.shareSeedSubscriber = this.contract.events.ShareSeed({
      fromBlock: 0
    }, (error: any, event: any) => this.onShareSeed(error, event))
  }

  destroy() {
    // Unsubscribe contact messages
    for (const contact of this.contacts) {
      contact.unsubscribe();
    }

    // Unsubscribe ShareSeed event
    if (this.shareSeedSubscriber != undefined) {
      this.shareSeedSubscriber.unsubscribe()
    }
  }

  private async onShareSeed(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    // Check if the message is for me
    if (event.returnValues.to.toLowerCase() == this.currentAddress.toLowerCase()) {
      const from = String(event.returnValues.from)
      const encrypted_seed = event.returnValues.to_seed
      this.contacts.push(await DeadDropContact.create(from, encrypted_seed))
    } else if (event.returnValues.from.toLowerCase() == this.currentAddress.toLowerCase()) {
      const to = String(event.returnValues.to)
      const encrypted_seed = event.returnValues.from_seed
      this.contacts.push(await DeadDropContact.create(to, encrypted_seed))
    }
    this.cdr.detectChanges();
  }

  async sendMessage(selectedContact: DeadDropContact, message: any): Promise<void> {
    let contactPublicKey = (await Contact.getContactInfo(selectedContact.getAddress())).publicKey
    let encryptedMessage = encrypt(message, contactPublicKey, 'x25519-xsalsa20-poly1305')
    const timestamp = Date.now()

    const decrypted_seed: string = await selectedContact.getDecryptedSeed()
    const token = getToken(decrypted_seed, {
      digits: 128,
      algorithm: 'SHA-512',
      period: 60,
      // @ts-ignore
      timestamp: Number(timestamp)
    })
    // Enviarlo a la red
    await this.contract.methods.sendMessage(token, timestamp, encryptedMessage).send({from: this.currentAddress})
  }

  isSubscribed(address: string): boolean {
    return this.sendMessageSubscriptions.has(address)
  }

  subscribeToSendMessage(address: string): void {
    if (this.sendMessageSubscriptions.has(address))
      this.sendMessageSubscriptions.get(address).unsubscribe();

    this.sendMessageSubscriptions.set(
      address,
      this.contract.events.SendMessage({
        filter: {'from': address},
        fromBlock: 0
      }, (error: any, event: any) => this.onMessageEvent(error, event))
    )
  }

  private async onMessageEvent(error: any, event: any): Promise<void> {
    // Check errors
    if (error !== null)
      throw error

    // Check if the message is for me
    if (!await this.isTheMessageForMe(event)) return

    // Add message to the corresponding chat
    let from = event.returnValues.from

    const contact = this.getContact(from)

    if (contact == undefined)
      throw 'contact is undefined'

    contact.addMessage(new MessageDeadDrop(from, new Date(Number(event.returnValues.timestamp)), event.returnValues.message, this.cdr))
    this.cdr.detectChanges();
  }

  private async isTheMessageForMe(event: any): Promise<boolean> {
    const from = String(event.returnValues.from)

    if (this.getContact(from) == undefined) return false;

    // @ts-ignore
    const token = getToken(await this.getContact(from)?.getDecryptedSeed(), {
      digits: 64,
      algorithm: 'SHA-512',
      period: 60,
      // @ts-ignore
      timestamp: Number(event.returnValues.timestamp)
    })

    return event.returnValues.totp == token
  }

  getContacts(): DeadDropContact[] {
    return this.contacts
  }

  // Create a new chat
  async newChat(address: any): Promise<void> {
    const destinationAddress = address
    const token_seed: string = this.generateSeed()

    const destPublicKey = (await Contact.getContactInfo(destinationAddress)).publicKey

    const from_seed = encrypt(token_seed, this.currentPublicKey, 'x25519-xsalsa20-poly1305')
    const to_seed = encrypt(token_seed, destPublicKey, 'x25519-xsalsa20-poly1305')

    await this.contract.methods.shareSeed(destinationAddress, from_seed, to_seed).send({from: this.currentAddress})
  }

  generateSeed(length?: number): string {
    let result = ''
    const seedLength = 20
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const charactersLength = characters.length
    for (let i = 0; i < (length || seedLength); i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
  }

  getContact(address: string): DeadDropContact | undefined {
    for (let contact of this.contacts) {
      if (contact.getAddress() == address)
        return contact
    }
    return undefined
  }

}
