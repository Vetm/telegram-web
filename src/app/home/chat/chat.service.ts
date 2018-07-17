import {EventEmitter, Injectable} from '@angular/core';
import {MtprotoService} from "../../mtproto.service";
import {ChatListService} from "../chat-list/chat-list.service";

@Injectable()
export class ChatService {

  public currentChatId;
  public messages;
  public chatLoaded: EventEmitter<boolean> = new EventEmitter();

  constructor(private mtp: MtprotoService, private cs: ChatListService) {
  }

  changeCurrentChat(chat) {
    if (!this.currentChat || this.currentChat.id !== chat.id) {
      this.currentChat = chat.id;
      this.loadHistory(chat).then();
    }
  }

  async loadHistory(chat) {
    this.chatLoaded.next(false);
    this.messages = [];
    const chatHistoryData = await this.mtp.getHistory(chat);
    this.messages = this.transformMessages(chatHistoryData.messages);
    this.chatLoaded.next(true);
    console.log(this.messages);
  }

  addMessages(messages) {
    this.messages = this.mergeMessages(this.messages, this.transformMessages(messages.messages));
    this.chatLoaded.next(true);
  }

  // TODO: reduce message range
  async refreshMessages() {
    const newMessageHistory = await this.mtp.getHistory(this.currentChat, 0, 25);
    const newMessages = this.transformMessages(newMessageHistory.messages);
    const messages = this.mergeMessages(this.messages, newMessages);
    if (messages.length !== this.messages.length) {
      this.chatLoaded.next(true);
    }
    this.messages = messages;
  }

  transformMessages(messages) {
    messages = messages.reverse();

    for (const message of messages) {
      if (message.from_id === this.mtp.userId) {
        message.self = true;
      }
    }
    return messages;
  }

  private mergeMessages(currentMessages, newMessages) {
    const msgObj = {};
    const msgArray = [];
    for (const curMsg of currentMessages) {
      msgObj[curMsg.id] = curMsg;
    }
    for (const newMsg of newMessages) {
      msgObj[newMsg.id] = newMsg;
    }
    for (const id of Object.keys(msgObj)) {
      if (msgObj.hasOwnProperty(id)) {
        msgArray.push(msgObj[id]);
      }
    }
    msgArray.sort(this.sortMessages);
    return msgArray;
  }

  private sortMessages(a, b) {
    return a.id - b.id;
  };

  get currentChat() {
    return this.cs.getChatById(this.currentChatId);
  }

  set currentChat(id) {
    this.currentChatId = id;
  }
}
