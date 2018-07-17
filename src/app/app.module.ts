import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import {MtprotoService} from "./mtproto.service";
import {FormsModule, NgForm} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChatListComponent } from './home/chat-list/chat-list.component';
import { ChatComponent } from './home/chat/chat.component';
import {
  MatButtonModule, MatCardModule,
  MatFormFieldModule, MatIconModule, MatInputModule,
  MatListModule, MatProgressSpinnerModule,
  MatSidenavModule, MatSnackBarModule,
  MatToolbar,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ShortDatePipe } from './short-date.pipe';
import {ChatService} from "./home/chat/chat.service";
import { MessageComponent } from './home/chat/messages/message/message.component';
import { MessageBarComponent } from './home/chat/message-bar/message-bar.component';
import {UpdateService} from "./home/update.service";
import {ChatListService} from "./home/chat-list/chat-list.service";
import { EmojiPickerComponent } from './home/chat/message-bar/emoji-picker/emoji-picker.component';
import {StorageService} from "./storage.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ChatComponent,
    ChatListComponent,
    ShortDatePipe,
    MessageComponent,
    MessageBarComponent,
    EmojiPickerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [MtprotoService, ChatService, ChatListService, UpdateService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
