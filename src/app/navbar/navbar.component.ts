import { Component, OnInit } from '@angular/core';
declare const window: any

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public account: string = ''

  constructor() { }

  async ngOnInit(): Promise<void> {
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    this.account = accounts[0]
  }
}
