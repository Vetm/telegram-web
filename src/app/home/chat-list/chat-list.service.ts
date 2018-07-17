import { Injectable } from '@angular/core';

@Injectable()
export class ChatListService {

  public chatHistory = [];
  public photos = {};

  constructor() { }

  getChatById(id) {
    for (const chat of this.chatHistory) {
      if (chat.id == id) {
        return chat;
      }
    }
  }

}
