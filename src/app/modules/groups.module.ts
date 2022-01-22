import {Contact, GroupContact, Message} from "./chat.entities";

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

  constructor(private currentAddress: string, private currentPublicKey: string, private cdr: ChangeDetectorRef) {
    this.contract = new window.web3.eth.Contract(
      GroupContract.abi,
      environment.group_address
    )

    this.onInviteSubscriber = this.contract.events.onInvite({
      fromBlock: 0
    }, (error: any, event: any) => this.onInviteShared(error, event))
  }

  destroy() {
    for (const contact of this.groups) {
      contact.unsubscribe();
    }

    if (this.onInviteSubscriber != undefined) {
      this.onInviteSubscriber.unsubscribe()
    }
  }

  // Cuando llega una invitacion hay que aceptarla
  private async onInviteShared(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    if (event.returnValues.to.toLowerCase() == this.currentAddress.toLowerCase()) {
      const group = String(event.returnValues.group)
      const groupKey = event.returnValues.groupKey
      const groupName = event.returnValues.groupName
      this.groups.push(await GroupContact.create(group, groupKey, groupName))
    }
    this.cdr.detectChanges();
  }

  async sendMessage(selectedGroup: GroupContact, message: any): Promise<void> {
    const groupKey: string = await selectedGroup.getDecryptedKey()
    let encryptedMessage = encrypt(message, groupKey, 'xsalsa20-poly1305')
    await this.contract.methods.sendMessage(selectedGroup.getAddress(), encryptedMessage).send({from: this.currentAddress})
  }

  isSubscribed(groupAddress: string): boolean {
    return this.sendMessageSubscriptions.has(groupAddress)
  }

  async subscribeToSendMessage(groupAddress: string): Promise<void> {
    if (this.isSubscribed(groupAddress))
      this.sendMessageSubscriptions.get(groupAddress).unsubscribe();

    await this.getGroup(groupAddress)?.getDecryptedKey()

    this.sendMessageSubscriptions.set(
      groupAddress,
      this.contract.events.onMessage({
        filter: {'group': groupAddress},
        fromBlock: 0
      }, (error: any, event: any) => this.onMessageEvent(error, event))
    )
  }

  private async onMessageEvent(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    if (!this.isTheMessageForMe(event))
      return

    const groupKey = await this.getGroup(event.returnValues.group)?.getDecryptedKey()

    if (groupKey == undefined)
      throw "Public key is undefined. Cant decrypt the message"

    let message = await decrypt(event.returnValues.message, groupKey, 'xsalsa20-poly1305')
    let from = event.returnValues.from

    const group = this.getGroup(event.returnValues.group)

    if (group == undefined)
      throw 'contact is undefined'

    group.addMessage(new Message(from, new Date(Number(event.returnValues.timestamp)), message))
    this.cdr.detectChanges();
  }

  private isTheMessageForMe(event: any): boolean {
    const group = String(event.returnValues.group)
    return this.getGroup(group) != undefined;
  }

  getGroups(): GroupContact[] {
    return this.groups
  }

  async newChat(name: any): Promise<void> {
    const groupName = name
    const groupAddress = window.web3.eth.accounts.create(window.web3.utils.randomHex(32)).address;

    const groupKey = naclUtil.encodeBase64(nacl.randomBytes(32));
    const cypherKey = encrypt(groupKey, this.currentPublicKey, 'x25519-xsalsa20-poly1305')

    await this.contract.methods.createGroup(groupAddress, groupName, cypherKey).send({from: this.currentAddress})

  }

  getGroup(address: string): GroupContact | undefined {
    for (let contact of this.groups) {
      if (contact.getAddress() == address)
        return contact
    }
    return undefined
  }

  async newInvite(destAddress: any, selectedGroup: GroupContact) {
    const groupAddress = selectedGroup.getAddress()
    const groupKey = await selectedGroup.getDecryptedKey()

    const destPublicKey = (await Contact.getContactInfo(destAddress)).publicKey

    const encryptedGroupKey = encrypt(groupKey, destPublicKey, 'x25519-xsalsa20-poly1305')

    this.contract.methods.invite(destAddress, groupAddress, encryptedGroupKey).send({from: this.currentAddress})
  }

  async givePerms(destAddress: any, selectedGroup: GroupContact, permissions: number) {
    if (permissions < 2 || permissions > 4) {
      throw 'Permission must be between 2 and 4'
    }
    const groupAddress = selectedGroup.getAddress()
    this.contract.methods.changePermissions(destAddress, groupAddress, permissions).send({from: this.currentAddress})
  }
}
