import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class Store {
    private currentAccountAddress: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

    getCurrentAccountAddress(): Observable<string|undefined> {
        return this.currentAccountAddress.asObservable()
    }

    getCurrentAccountAddressValue(): string {
        return this.currentAccountAddress.getValue() ?? ''
    }

    setCurrentAccountAddress(address: string|undefined): void {
        this.currentAccountAddress.next(address)
    }
}