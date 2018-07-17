import {EventEmitter, HostListener, Injectable} from '@angular/core';
import {MtprotoService} from "../mtproto.service";
import {ChatService} from "./chat/chat.service";
import {ChatListService} from "./chat-list/chat-list.service";

declare let Notification;

@Injectable()
export class UpdateService {

  private pts = 0;
  public unread = 0;
  public updates: EventEmitter<boolean> = new EventEmitter();

  constructor(private mtp: MtprotoService, private cs: ChatListService, private c: ChatService) {
    this.startUpdateInterval();

    if (Notification) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission().then();
      }
    }

    this.mtp.updateStatus(false).then();
    window.onfocus = () => {
      this.mtp.updateStatus(false).then();
    };

    window.onblur = () => {
      this.mtp.updateStatus(true).then();
    };
  }

  startUpdateInterval() {
    setInterval(() => {
      this.checkForUpdates().then();
      this.checkNewMessages(this.cs.chatHistory);
    }, 5000);
  }

  async checkForUpdates() {
    const state = await this.mtp.getState();
    if (state && this.pts !== state.pts) {
      this.pts = state.pts;
      this.unread = state.unread_count;
      this.updates.next(true);
    }
  }

  checkNewMessages(chatHistory) {
    const newNotifiedUnreads = [];

    for (const chat of chatHistory) {
      if (chat.unreadCount > 0) {
        if (!this.notifiedUnreads.includes(chat.lastMessageId) && (this.c.currentChat.id !== chat.id || document.hidden)) {
          this.sendNotification(chat);
        }
        newNotifiedUnreads.push(chat.lastMessageId);
      }
    }
    this.notifiedUnreads = newNotifiedUnreads;
  }

  sendNotification(chat) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(chat.title, {
        icon: this.cs.photos[chat.id],
        body: chat.lastMessage
      })
    }
  }

  set notifiedUnreads(messageIds) {
    localStorage.setItem('notified_unreads', JSON.stringify(messageIds));
  }

  get notifiedUnreads() {
    const unreads = JSON.parse(localStorage.getItem('notified_unreads'));
    return (unreads || []);
  }

  markAsRead() {
    const activeChat = this.cs.getChatById(this.c.currentChat.id);
    if (activeChat.unreadCount > 0) {
      this.mtp.readHistory(this.c.currentChat).then();
    }
    activeChat.unreadCount = 0;
  }

}
