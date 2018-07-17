import {Component, Input, OnInit} from '@angular/core';
import {MtprotoService} from "../../../mtproto.service";
import {ChatService} from "../chat.service";
import {UpdateService} from "../../update.service";

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {

  @Input('chat') chat;
  public message = '';

  constructor(private mtp: MtprotoService, private c: ChatService, private u: UpdateService) {
  }

  ngOnInit() {
  }

  async sendMessage() {
    if (this.message !== '') {
      const message = this.message;
      this.message = '';
      const sentMessage = await this.mtp.sendMessage(this.chat, message);
      sentMessage.message = message;
      sentMessage.self = true;
      //this.c.addMessages({messages: [sentMessage]});
      await this.u.checkForUpdates();
    }
  }

  setTyping() {
    this.mtp.setTyping(this.chat, 'sendMessageTypingAction').then();
  }

}
