import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

import {encrypt, decrypt} from '../modules/encryption.module';

import getToken from 'totp-generator';

// @ts-ignore
import DeadDrop from '../../assets/contracts/DeadDrop.json'

declare const window: any;

// @ts-ignore
@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})
export class DeadDropComponent implements OnInit {

  private creatingChat: boolean = false;

  private selectedAddress = ''

  private contacts: Map<string, {encrypted_seed: string, decrypted_seed: string|undefined}> = new Map();
  private messages: Map<string, string[]> = new Map();

  private contract = new window.web3.eth.Contract(
    DeadDrop.abi,
    environment.deaddrop_address
  )

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    //Registramos los eventos para escuchar si te llegan mensajes y si te llegan semillas
    let addresses = await window.ethereum.request({method: 'eth_accounts'});

    // Obtenemos los contactos
    let shareSeedPastEvents = await this.contract.getPastEvents('ShareSeed', {
      fromBlock: 0
    })

    for (let event of shareSeedPastEvents) {
      await this.onShareSeed(null, event)
    }

    // Creamos los eventos para leer nuevos contactos y mensajes en tiempo real
    this.contract.events.ShareSeed({},
      (error: any, event: any) => this.onShareSeed(error, event))

    // this.contract.events.SendMessage({
    //   fromBlock: 0
    // }, (error: any, event: any) => this.onMessageEvent(error, event))
  }

  // Cuando llega un mensaje se añade a la lista de mensajes
  async onMessageEvent(error: any, event: any): Promise<void> {
    // Check errors
    if (error !== null)
      throw error

    // Check if the message is for me
    if (!this.isTheMessageForMe(event)) return

    // Decrypt message
    console.log(event.returnValues.message)
    let message = await decrypt(event.returnValues.message, 'x25519-xsalsa20-poly1305')

    // Add message to the corresponding chat
    let from = event.returnValues.from

    // @ts-ignore
    let messages: string[] = this.messages.get(from) == undefined ? [] : this.messages.get(from)
    messages.push(message)
    this.messages.set(from, messages)

    console.log(message)
  }

  // Checks if the message is for me
  isTheMessageForMe(event: any): boolean {
    const from = String(event.returnValues.from)

    if (this.contacts.get(from) == undefined) return false;

      // @ts-ignore
    const token = getToken(this.contacts.get(from)?.decrypted_seed, {
      digits: 64,
      algorithm: 'SHA-512',
      period: 60,
      // @ts-ignore
      timestamp: Number(event.returnValues.timestamp)
    })

    return event.returnValues.totp == token
  }

  async sendMessage(message: any): Promise<void> {
    let contactPublicKey = await this.contract.methods.getPublicKey(this.selectedAddress).call()
    let encryptedMessage = encrypt(message, contactPublicKey, 'x25519-xsalsa20-poly1305')
    const timestamp = Date.now()
    const token = getToken(<string>this.contacts.get(this.selectedAddress)?.decrypted_seed, {
      digits: 128,
      algorithm: 'SHA-512',
      period: 60,
      // @ts-ignore
      timestamp: Number(timestamp)
    })
    // Enviarlo a la red
    let addresses = await window.ethereum.request({method: 'eth_accounts'});
    this.contract.methods.sendMessage(token, timestamp, encryptedMessage).send({from: addresses[0]})
      .then((receipt: any) => {

      })
  }

  // Cuando llega una semilla la añadimos a la lista de semillas
  async onShareSeed(error: any, event: any): Promise<void> {
    if (error !== null)
      throw error

    let addresses = await window.ethereum.request({method: 'eth_accounts'});

    // Check if the message is for me
    if (event.returnValues.to.toLowerCase() == addresses[0].toLowerCase()) {
      const from = String(event.returnValues.from)
      const encrypted_seed = event.returnValues.to_seed
      this.contacts.set(from, {
        encrypted_seed: encrypted_seed,
        decrypted_seed: undefined
      })
    } else if (event.returnValues.from.toLowerCase() == addresses[0].toLowerCase()) {
      const to = String(event.returnValues.to)
      const encrypted_seed = event.returnValues.from_seed
      this.contacts.set(to, {
        encrypted_seed: encrypted_seed,
        decrypted_seed: undefined
      })
    }
  }

  // Create a new chat
  async newChat($event: any, address: any): Promise<void> {
    $event.preventDefault()

    let addresses = await window.ethereum.request({method: 'eth_accounts'});

    const destinationAddress = address.value
    const token_seed: string = 'ALFABETO' // todo hacer semilla aleatoria

    let myPublicKey = await this.contract.methods.getPublicKey(addresses[0]).call()
    let contactPublicKey = await this.contract.methods.getPublicKey(destinationAddress).call()

    const from_seed = encrypt(token_seed, myPublicKey, 'x25519-xsalsa20-poly1305')
    const to_seed = encrypt(token_seed, contactPublicKey, 'x25519-xsalsa20-poly1305')

    this.contract.methods.shareSeed(destinationAddress, from_seed, to_seed).send({from: addresses[0]})
      .then(((receipt: any) => {
          }
        )
      )
  }

  get getAddresses(): string[] {
    return [...this.contacts.keys()];
  }

  async setSelectedAddress(address: string): Promise<void> {
    this.selectedAddress = address
    this.creatingChat = false

    if (this.contacts.get(address)?.decrypted_seed == undefined) {
      const encrypted_seed = this.contacts.get(address)?.encrypted_seed

      if (encrypted_seed == undefined)
        throw 'encrypted_seed is not defined'

      this.contacts.set(address, {
        encrypted_seed: encrypted_seed,
        decrypted_seed: await decrypt(encrypted_seed, 'x25519-xsalsa20-poly1305')
      })
    }

    this.contract.getPastEvents('SendMessage', {
      filter: {'from': address},
      fromBlock: 0
    }, (error: any, events: any) => {
      console.log(events)
      for (let event of events)
        this.onMessageEvent(error, event)
    })
  }

  getSelectedAddress(): any {
    return this.selectedAddress
  }

  getMessagesSelected(): any {
    return this.messages.get(this.selectedAddress)
  }

  onNewChat(): void {
    this.creatingChat = true
  }

  get isCreatingChat(): boolean {
    return this.creatingChat
  }
}
