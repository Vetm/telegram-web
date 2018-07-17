import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "./chat.service";
import {UpdateService} from "../update.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('chat') chat;
  public loading = false;
  private interval;

  constructor(public c: ChatService, private u: UpdateService) {
    // If chat updated, scroll to newest message and mark messages as read
    this.c.chatLoaded.subscribe(evt => {
      if (evt) {
        setTimeout(() => {
          this.scrollDown();
          this.u.markAsRead();
          this.loading = false;
        }, 0);
      } else {
        this.loading = true;
      }
    });

    this.u.updates.subscribe(() => {
      this.c.refreshMessages().then();
    })
  }

  ngOnInit() {
  }

  // TODO: Exception if user has scrolled up. Add fab to scroll down instead.
  scrollDown() {
    setTimeout(() => {
      this.chat.nativeElement.scrollBy(0, this.chat.nativeElement.scrollHeight);
    }, 0);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  isRead(message) {
    return (this.c.currentChat.peerReadId >= message.id);
  }

}
