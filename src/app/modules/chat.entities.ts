import {encrypt, decrypt} from '../modules/encryption.module';
import {BehaviorSubject, Observable} from "rxjs";
import { ChangeDetectorRef } from '@angular/core';

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
        this.decrypted_seed =  await decrypt(this.encrypted_seed, '')
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

export class Message {

    private decryptedMessage: string|undefined = undefined

    constructor(private sender: string, private timestamp: Date, private message: string, private cdr: ChangeDetectorRef) { }

    public getSender(): string {
        return this.sender
    }

    public getTimestamp(): Date {
        return this.timestamp
    }

    public getMessage(): string {
        return this.decryptedMessage ?? "Encrypted message (click)"
    }

    public async decryptMessage(): Promise<void> {
        if (this.decryptedMessage != undefined) return

        this.decryptedMessage = await decrypt(this.message, "x25519-xsalsa20-poly1305")
        this.cdr.detectChanges();
    }

    public isEncrypted(): boolean {
        return this.decryptedMessage == undefined
    }
}