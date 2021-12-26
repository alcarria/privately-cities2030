import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
// @ts-ignore
import Groups from '../../assets/contracts/Groups.json'
import {GroupContact, Message} from "../modules/chat.entities";
import {GroupController} from "../modules/groups.module";
import {Store} from "../modules/store";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {InvitedialogComponent} from "../invitedialog/invitedialog.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PermdialogComponent} from "../permdialog/permdialog.component";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})

export class GroupsComponent implements OnInit {

  public selectedGroup: GroupContact | undefined = undefined
  private GroupController: GroupController;
  public messagesObservable: Observable<Message[]> = new Observable<Message[]>()

  /*
  0: uso normal
  1: creando chat
  2: invitando al chat
   */
  private userActions = 1

  constructor(private store: Store, private cdr: ChangeDetectorRef, private router: Router, public dialog: MatDialog) {
    this.GroupController = new GroupController(this.store.getCurrentAccountAddressValue(), cdr)
  }

  async ngOnInit(): Promise<void> {
    this.store.getCurrentAccountAddress().subscribe(_ => {
      this.selectedGroup = undefined
      this.GroupController.destroy()
      this.GroupController = new GroupController(this.store.getCurrentAccountAddressValue(), this.cdr)
    })
  }

  ngOnDestroy(): void {
    this.GroupController.destroy();
  }

  async sendMessage(message: any): Promise<void> {
    if (this.selectedGroup == undefined)
      throw 'Cannot send message to undefined. You need to pick a contact first.'

    await this.GroupController.sendMessage(this.selectedGroup, message);
  }

  get getAddresses(): string[] {
    let addresses: string[] = []
    for (let contact of this.GroupController.getGroups()) {
      addresses.push(contact.getAddress())
    }
    return addresses
  }

  async setSelectedAddress(groupAddress: string): Promise<void> {

    if (this.selectedGroup?.getAddress() == groupAddress)
      return

    this.selectedGroup = this.GroupController.getGroup(groupAddress);

    if (!this.GroupController.isSubscribed(groupAddress))
      await this.GroupController.subscribeToSendMessage(groupAddress);
    this.userActions = 0
    this.cdr.detectChanges();
  }

  getSelectedAddress(): string {
    return this.selectedGroup?.getGroupName() ?? ''
  }

  getMessagesSelected(): any {
    if (this.selectedGroup == undefined)
      throw 'Cannot get messages: contact is undefined'
    return this.selectedGroup.getMessages()
  }

  onNewChat(): void {
    this.userActions = 1
    this.selectedGroup = undefined
  }

  async newChat($event: any, name: any): Promise<void> {
    $event.preventDefault()
    await this.GroupController.newChat(name)
    this.userActions = 1
  }

  get userActionStatus(): number {
    return this.userActions;
  }

  openInviteDialog() {
    const dialogConf = new MatDialogConfig()

    dialogConf.disableClose = false;

    const dialogRef = this.dialog.open(InvitedialogComponent, dialogConf);

    dialogRef.afterClosed().subscribe(async address => {
      if (address == undefined)
        return
      if (this.selectedGroup == undefined)
        throw 'Must select group first'
      await this.GroupController.newInvite(address, this.selectedGroup)
    });
  }

  openPermDialog() {
    const dialogConf = new MatDialogConfig()

    dialogConf.disableClose = false;

    const dialogRef = this.dialog.open(PermdialogComponent, dialogConf);

    dialogRef.afterClosed().subscribe(async data => {
      console.log(data)
      if (data == undefined)
        return
      if (this.selectedGroup == undefined)
        throw 'Must select group first'
      await this.GroupController.givePerms(data.address, this.selectedGroup, data.permissions)
    });
  }
}
