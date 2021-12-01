import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from './material-module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DeadDropComponent } from './dead-drop/dead-drop.component';
import { ChatSidenavComponent } from './chat-sidenav/chat-sidenav.component';
import { ChatComponent } from './chat/chat.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'account', component: AccountComponent },
  { path: 'dead-drop', component: DeadDropComponent },
  { path: 'groups', component: GroupsComponent }
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
    GroupsComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
