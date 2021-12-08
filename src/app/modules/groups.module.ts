import {GroupContact, Message} from "./chat.entities";

// @ts-ignore
import GroupContract from '../../assets/contracts/Groups.json'
import {environment} from "src/environments/environment";
import {ChangeDetectorRef} from "@angular/core";
import {decrypt, encrypt} from "./encryption.module";
import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

declare let window: any;

export class GroupController {

  private contract: any;

  private groups: GroupContact[] = [];
  private onInviteSubscriber: any;

  private sendMessageSubscriptions: Map<string, any> = new Map<string, any>()

  constructor(private currentAddress: string, private cdr: ChangeDetectorRef) {
    this.contract = new window.web3.eth.Contract(
      GroupContract.abi,
      environment.group_address
    )

    // Get list of my groups
    this.onInviteSubscriber = this.contract.events.onInvite({
      fromBlock: 0
    }, (error: any, event: any) => this.onInviteShared(error, event))
  }

  destroy() {
    // Unsubscribe contact messages
    for (const contact of this.groups) {
      contact.unsubscribe();
    }

    // Unsubscribe ShareSeed event
    if (this.onInviteSubscriber != undefined) {
      this.onInviteSubscriber.unsubscribe()
    }
  }

  // Cuando llega una invitacion hay que aceptarla
  private async onInviteShared(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    // Check if the message is for me
    if (event.returnValues.to.toLowerCase() == this.currentAddress.toLowerCase()) {
      const group = String(event.returnValues.group)
      const groupKey = event.returnValues.groupKey
      this.groups.push(new GroupContact(group, groupKey))
    }
    this.cdr.detectChanges();
  }

  async sendMessage(selectedGroup: GroupContact, message: any): Promise<void> {
    const groupKey: string = await selectedGroup.getDecryptedKey()
    console.log('Ya tengo la clave del grupo')
    let encryptedMessage = encrypt(message, groupKey, 'xsalsa20-poly1305')
    console.log('A punto de enviar el mensaje')
    console.log('Grupo al que se envia el mensaje: ' + selectedGroup.getAddress())
    this.contract.methods.sendMessage(selectedGroup.getAddress(), encryptedMessage).send({from: this.currentAddress})
  }

  async subscribeToSendMessage(group_address: string): Promise<void> {
    console.log('Subscricion en marcha')
    if (this.sendMessageSubscriptions.has(group_address))
      this.sendMessageSubscriptions.get(group_address).unsubscribe();

    console.log('Group address: ' + group_address)
    await this.sendMessageSubscriptions.set(
      group_address,
      this.contract.events.onMessage({
        filter: {'group': group_address},
        fromBlock: 0
      }, (error: any, event: any) => this.onMessageEvent(error, event))
    )
  }

  private async onMessageEvent(error: any, event: any): Promise<void> {
    console.log('He recibido un mensaje')
    // Check errors
    if (error !== null)
      throw error
    // Check if the message is for me
    if (!this.isTheMessageForMe(event)) return
    console.log('Es para mi')
    // Decrypt message
    console.log(event.returnValues.message)
    const groupKey = await this.getContact(event.returnValues.group)?.getDecryptedKey()

    if (groupKey == undefined)
      throw "Public key is undefined. Cant decrypt the message"

    let message = await decrypt(event.returnValues.message, groupKey, 'xsalsa20-poly1305')
    console.log(message)
    // Add message to the corresponding chat
    let from = event.returnValues.group

    console.log('Grupo despues de descifrar: ' + from)

    const group = this.getContact(from)

    if (group == undefined)
      throw 'contact is undefined'

    group.addMessage(new Message(from, new Date(Number(event.returnValues.timestamp)), message))
  }

  private isTheMessageForMe(event: any): boolean {
    const group = String(event.returnValues.group)
    return this.getContact(group) != undefined;
  }

  getContacts(): GroupContact[] {
    return this.groups
  }

  // Create a new chat
  async newChat(address: any): Promise<void> {
    const groupName = address.value
    const groupAddress = window.web3.eth.accounts.create(window.web3.utils.randomHex(32)).address;
    let myPublicKey = await this.contract.methods.getPublicKey(this.currentAddress).call()

    const groupKey = naclUtil.encodeBase64(nacl.randomBytes(32));
    const cypherKey = encrypt(groupKey, myPublicKey, 'x25519-xsalsa20-poly1305')

    this.contract.methods.createGroup(groupAddress, groupName, cypherKey).send({from: this.currentAddress})

  }

  getContact(address: string): GroupContact | undefined {
    for (let contact of this.groups) {
      if (contact.getAddress() == address)
        return contact
    }
    return undefined
  }
}
