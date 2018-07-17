import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {MtprotoService} from '../../mtproto.service';
import {ColorGeneratorService} from '../../color-generator.service';
import {ChatService} from '../chat/chat.service';
import {ActivatedRoute} from '@angular/router';
import {UpdateService} from '../update.service';
import {ChatListService} from './chat-list.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  providers: [ColorGeneratorService]
})
export class ChatListComponent implements OnInit, AfterViewInit {

  constructor(private mtp: MtprotoService, public cg: ColorGeneratorService, public c: ChatService, public cs: ChatListService, private route: ActivatedRoute, private u: UpdateService) {
    this.u.updates.subscribe(() => {
      this.getDialogs().then(() => {
        this.u.markAsRead();
      });
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.init();
    }, 500);
  }

  async init() {
    await this.getDialogs();
    const id = this.route.snapshot.params.id;
    if (id && this.cs.getChatById(id)) {
      this.c.changeCurrentChat(this.cs.getChatById(id));
    }
    await this.loadImages();
  }

  async getDialogs() {
    this.cs.chatHistory = await this.mtp.getDialogs();
  }

  async loadImages() {
    for (const chat of this.cs.chatHistory) {
      if (chat.photo) {
        this.mtp.getFile(chat.photo, 'photo').then((photo) => {
          this.cs.photos[chat.id] = photo;
        });
      }
    }
  }
}
