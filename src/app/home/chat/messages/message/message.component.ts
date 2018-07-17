import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MtprotoService} from "../../../../mtproto.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input('message') message;
  @Input('read') read;
  @ViewChild('photoInner') photoInner;
  public type = 'text';
  public photo;

  constructor(public mtp: MtprotoService) { }

  ngOnInit() {
    this.parseEntities();
    if (this.message.media) {
      if (this.message.media.photo) {
        this.type = 'photo';
        this.loadPhoto().then();
      }
    }
  }

  getTime(unixDate) {
    return new Date(unixDate * 1000);
  }

  parseEntities() {
    if (this.message.entities) {
      for (const entity of this.message.entities) {
        if (entity._ === 'messageEntityUrl') {
          const link = this.message.message.substr(entity.offset, entity.length);
          console.log(link);
          this.message.message = this.message.message.replace(link, `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`);
        }
      }
    }
  }

  async loadPhoto() {
    this.photo = await this.mtp.getFile(
      this.message.media.photo.sizes[this.message.media.photo.sizes.length - 1].location,
      'photo'
    );
  }

  get imageSize() {
    //TODO: find cleaner solution with scss
    const maxWidth = 380;
    const photoSize = {
      width: this.message.media.photo.sizes[this.message.media.photo.sizes.length - 1].w,
      height: this.message.media.photo.sizes[this.message.media.photo.sizes.length - 1].h
    };

    if (photoSize.width > maxWidth) {
      const sizeDifference = maxWidth / photoSize.width;
      photoSize.width = photoSize.width * sizeDifference;
      photoSize.height = photoSize.height * sizeDifference;
    }
    return photoSize;
  }
}
