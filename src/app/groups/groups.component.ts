import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

import {encrypt, decrypt} from '../modules/encryption.module';

import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

// @ts-ignore
import Groups from '../../assets/contracts/Groups.json'

declare const window: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  private creatingChat: boolean = false;

  private selectedGroup = ''

  private groups: Map<string, { encrypted_key: string, decrypted_key: string | undefined }> = new Map();
  private messages: Map<string, string[]> = new Map();

  private contract = new window.web3.eth.Contract(
    Groups.abi,
    environment.group_address
  )

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    // Obtenemos los grupos en los que estamos
    let onInvitePastEvents = await this.contract.getPastEvents('onInvite', {
      fromBlock: 0
    })

    for (let event of onInvitePastEvents) {
      await this.onInviteShared(null, event)
    }

    // Creamos los eventos para leer nuevos grupos y mensajes en tiempo real
    this.contract.events.onInvite({},
      (error: any, event: any) => this.onInviteShared(error, event))
  }

  // Cuando llega un mensaje se añade a la lista de mensajes
  async onMessageEvent(error: any, event: any): Promise<void> {
    // Check errors
    if (error !== null)
      throw error

    // Check if the message is for me
    if (!this.isTheMessageForMe(event)) return

    const group = this.groups.get(event.returnValues.group)

    if (group == undefined)
      throw 'Group is not defined'

    if (group.encrypted_key == undefined)
      throw 'Encrypted_key is unavailable'

    if (group.decrypted_key == undefined)
      throw 'Encrypted_key is unavailable'

    // Decrypt message
    let message = await decrypt(event.returnValues.message, group.decrypted_key, 'xsalsa20-poly1305')

    // Add message to the corresponding chat
    let fromGroup = event.returnValues.group

    // @ts-ignore
    let messages: string[] = this.messages.get(fromGroup) == undefined ? [] : this.messages.get(fromGroup)
    messages.push(message)
    this.messages.set(fromGroup, messages)
  }

  // Checks if the message is for me
  isTheMessageForMe(event: any): boolean {
    const groupAddress = String(event.returnValues.group)

    return this.groups.get(groupAddress) != undefined;
  }

  async sendMessage(message: any): Promise<void> {
    const group = this.groups.get(this.selectedGroup)

    if (group == undefined)
      throw 'group is undefined'

    if (group.decrypted_key == undefined)
      throw 'decrypted_key is undefined'

    let encryptedMessage = encrypt(message, group.decrypted_key, 'xsalsa20-poly1305')

    // Enviarlo a la red
    let addresses = await window.ethereum.request({method: 'eth_accounts'});
    this.contract.methods.sendMessage(this.selectedGroup, encryptedMessage).send({from: addresses[0]})
  }

  // Cuando llega una semilla la añadimos a la lista de semillas
  async onInviteShared(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    let addresses = await window.ethereum.request({method: 'eth_accounts'});

    // Check if the message is for me
    if (event.returnValues.to.toLowerCase() == addresses[0].toLowerCase()) {
      const group = String(event.returnValues.group)
      const groupKey = event.returnValues.groupKey
      this.groups.set(group, {
        encrypted_key: groupKey,
        decrypted_key: undefined
      })
    }
  }

  // Create a new chat
  async newChat($event: any, name: any): Promise<void> {
    $event.preventDefault()

    let addresses = await window.ethereum.request({method: 'eth_accounts'});
    const groupAddress = window.web3.eth.accounts.create(window.web3.utils.randomHex(32)).address;

    let myPublicKey = await this.contract.methods.getPublicKey(addresses[0]).call()

    const groupKey = naclUtil.encodeBase64(nacl.randomBytes(32));
    const cypherKey = encrypt(groupKey, myPublicKey, 'x25519-xsalsa20-poly1305')

    this.contract.methods.createGroup(groupAddress, name, cypherKey).send({from: addresses[0]})
  }

  get getAddresses(): string[] {
    return [...this.groups.keys()];
  }

  async setSelectedAddress(groupAddress: string): Promise<void> {
    this.selectedGroup = groupAddress
    this.creatingChat = false

    const group: any = this.groups.get(groupAddress)

    if (group == undefined)
      throw 'group not exists'

    if (group.decrypted_key == undefined) {
      this.groups.set(groupAddress, {
        encrypted_key: group.encrypted_key,
        decrypted_key: await decrypt(group.encrypted_key, '','x25519-xsalsa20-poly1305')
      })
    }

    this.contract.getPastEvents('sendMessage', {
      filter: {'group': groupAddress},
      fromBlock: 0
    }, (error: any, events: any) => {
      console.log(events)
      for (let event of events)
        this.onMessageEvent(error, event)
    })
  }

  getSelectedAddress(): any {
    return this.selectedGroup
  }

  getMessagesSelected(): any {
    return this.messages.get(this.selectedGroup)
  }

  onNewChat(): void {
    this.creatingChat = true
  }

  get isCreatingChat(): boolean {
    return this.creatingChat
  }
}
