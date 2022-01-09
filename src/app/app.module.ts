import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';

import {HttpClientModule} from "@angular/common/http";
import {MaterialModule} from './material-module'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './login/login.component';
import {AccountComponent} from './account/account.component';
import {NavbarComponent} from './navbar/navbar.component';
import {DeadDropComponent} from './dead-drop/dead-drop.component';
import {ChatSidenavComponent} from './chat-sidenav/chat-sidenav.component';
import {ChatComponent} from './chat/chat.component';
import {GroupsComponent} from './groups/groups.component';
import {InvitedialogComponent} from './invitedialog/invitedialog.component'

import {Store} from './modules/store';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {PermdialogComponent} from './permdialog/permdialog.component';
import {PrivatesComponent} from './privates/privates.component';
import { HomeComponent } from './home/home.component';
import { RegisterdialogComponent } from './registerdialog/registerdialog.component';
import { NewchatdialogComponent } from './newchatdialog/newchatdialog.component';
import { NewgroupdialogComponent } from './newgroupdialog/newgroupdialog.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'account', component: AccountComponent},
  {path: 'dead-drop', component: DeadDropComponent},
  {path: 'groups', component: GroupsComponent},
  {path: 'privates', component: PrivatesComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    NavbarComponent,
    DeadDropComponent,
    ChatSidenavComponent,
    ChatComponent,
    GroupsComponent,
    InvitedialogComponent,
    PermdialogComponent,
    PrivatesComponent,
    HomeComponent,
    RegisterdialogComponent,
    NewchatdialogComponent,
    NewgroupdialogComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
