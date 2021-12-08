import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '../modules/store';
declare const window: any

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public address: string|undefined = ''

  constructor(private store: Store, private cdr: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.store.getCurrentAccountAddress().subscribe(address => {
      console.log('Address changed to ' + address)
      this.address = address
      this.cdr.detectChanges()
    })
    // let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    // this.account = accounts[0]
  }
}
