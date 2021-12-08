import {encrypt, decrypt} from './encryption.module';
import {BehaviorSubject, Observable} from "rxjs";

export class DeadDropContact {

    private decrypted_seed: string|undefined

    private subscription: any|undefined;
    private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

    constructor(private address: string, private encrypted_seed: string) { }

    public getAddress(): string {
        return this.address
    }

    public async getDecryptedSeed(): Promise<string> {
        if (this.decrypted_seed != undefined)
            return this.decrypted_seed
        this.decrypted_seed =  await decrypt(this.encrypted_seed, '','x25519-xsalsa20-poly1305' )
        return this.decrypted_seed
    }

    public getMessages(): Observable<Message[]> {
        return this.messages.asObservable();
    }

    public addMessage(message: Message): void {
        this.messages.next(
            [...this.messages.getValue(), message]
        )
    }

    public isSubscribed(): boolean {
        return this.subscription != undefined
    }

    public subscribe(eventEmitter: any): void {
        if (!this.isSubscribed()) {
            this.subscription = eventEmitter
        } else {
            throw 'A subcription already exists. Use isSubscribed() before attemping to subscribe'
        }
    }

    public unsubscribe(): void {
        if (this.isSubscribed()) {
            this.subscription.unsubscribe()
            this.subscription = undefined
        }
    }
}

export class GroupContact {

  private decrypted_pass: string|undefined

  private subscription: any|undefined;
  private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  constructor(private group_address: string, private encrypted_pass: string) { }

  public getAddress(): string {
    return this.group_address
  }

  public async getDecryptedKey(): Promise<string> {
    if (this.decrypted_pass != undefined)
      return this.decrypted_pass
    this.decrypted_pass =  await decrypt(this.encrypted_pass, '','x25519-xsalsa20-poly1305' )
    return this.decrypted_pass
  }

  public getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  public addMessage(message: Message): void {
    this.messages.next(
      [...this.messages.getValue(), message]
    )
  }

  public isSubscribed(): boolean {
    return this.subscription != undefined
  }

  public subscribe(eventEmitter: any): void {
    if (!this.isSubscribed()) {
      this.subscription = eventEmitter
    } else {
      throw 'A subcription already exists. Use isSubscribed() before attemping to subscribe'
    }
  }

  public unsubscribe(): void {
    if (this.isSubscribed()) {
      this.subscription.unsubscribe()
      this.subscription = undefined
    }
  }
}

export class Message {
    constructor(private sender: string, private timestamp: Date, private message: string) { }

    public getSender(): string {
        return this.sender
    }

    public getTimestamp(): Date {
        return this.timestamp
    }

    public getMessage(): string {
        return this.message
    }
}
