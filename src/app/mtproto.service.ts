import {Injectable} from '@angular/core';
import {Storage} from 'mtproto-storage-browser';
import {v4 as uuid} from 'uuid';
import {StorageService} from "./storage.service";
import {Router} from "@angular/router";

import {APIConfig} from "../telegram-api.conf";

declare let mtproto;

@Injectable()
export class MtprotoService {

  private api = {
    //invokeWithLayer: 0xda9b0d0d,
    layer: 57,
    initConnection: 0x69796de9,
    api_id: APIConfig.api_id,
    app_version: '1.0.1',
    lang_code: 'en'
  };

  private server = {
    dev: false,
    webogram: false
  };

  public client;

  constructor(private storage: StorageService, private router: Router) {
    const MTProto = mtproto.MTProto;
    const server = this.server;
    const api = this.api;
    // Bad workaround for mtproto lib
    const storageHack: any = Storage;
    const app = {storage: new storageHack() as any};
    this.client = MTProto({server, api, app});
    //this.mediaClient = MTProto({server, api, app});
  }

  //Authentication//
  public async requestCode(phoneNumber: string) {
    const auth = await this.client('auth.sendCode', {
      phone_number: phoneNumber,
      sms_type: 5,
      api_id: APIConfig.api_id,
      api_hash: APIConfig.api_hash
    });

    const codeHash = auth.phone_code_hash;

    this.phoneNumber = phoneNumber;
    this.codeHash = codeHash;

    return auth;
  }

  public async authorizeWithCode(code) {
    try {
      const user = await this.client('auth.signIn', {
        phone_number: this.phoneNumber,
        phone_code_hash: this.codeHash,
        phone_code: code
      });
      this.user = user;
      return user;
    } catch {
      return false;
    }
  }


  //Info Loading//
  public async getDialogs() {
    //console.log('LOAD DIALOGS');
    const data = await this.client('messages.getDialogs', {
      offset: 1,
      limit: 25
    });
    return this.generateChatHistory(data);
  }

  public async getFile(location, type = 'photo') {
    try {
      //TODO: use mediaClient
      const storedFile = await this.storage.retrieveFile(location);
      if (storedFile) {
        return storedFile;
      }
      const data = await this.client('upload.getFile', {
          location: {
            _: 'inputFileLocation',
            local_id: location.local_id,
            secret: location.secret,
            volume_id: location.volume_id
          }
        },
        {
          dcID: location.dc_id,
          fileDownload: true,
          createNetworker: true
        });


      if (type === 'photo') {
        return this.storage.saveFile(location, data.bytes, 'image/jpeg');
      } else {
        return data;
      }
    } catch (err) {
      console.error('GET FILE ERROR:', err);
      return undefined;
    }
  }

  public async getContacts() {
    //console.log(await this.client('contacts.getContacts'));
  }


  //Messaging//
  public async getHistory(chat, offset = 0, limit = 100, maxId = 0) {
    // console.log('LOAD HISTORY');
    //console.log(this.generateInputPeer(chat));
    return await this.client('messages.getHistory', {
      peer: this.generateInputPeer(chat),
      offset: offset,
      limit: limit,
      max_id: maxId
    });
  }

  public async sendMessage(chat, message) {
    const peer = {
      _: 'inputPeerUser',
      user_id: chat.id,
      access_hash: chat.accessHash
    };
    return await this.client('messages.sendMessage', {
      peer: peer,
      message: message,
      random_id: Math.floor(Math.random() * 1000000000)
    });
  }

  public async setTyping(chat, action) {
    await this.client('messages.setTyping', {
      peer: this.generateInputPeer(chat),
      typing: true,
      action: {
        _: action
      }
    });
  }

  public async readHistory(chat) {
    await this.client('messages.readHistory', {
      peer: this.generateInputPeer(chat),
      read_contents: true
    });
  }

  //Updates/
  public async getState() {
    try {
      return await this.client('updates.getState');
    } catch {
      this.router.navigate(['login']);
      return false;
    }
  }

  public async updateStatus(offline) {
    await this.client('account.updateStatus', {
      offline: offline
    });
  }


  set user(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  get user() {
    return JSON.parse(localStorage.getItem('user'));
  }

  get userId() {
    return JSON.parse(localStorage.getItem('user')).user.id;
  }

  set phoneNumber(phoneNumber) {
    localStorage.setItem('phone_number', phoneNumber);
  }

  get phoneNumber() {
    return localStorage.getItem('phone_number');
  }

  set codeHash(codeHash) {
    localStorage.setItem('code_hash', codeHash);
  }

  get codeHash() {
    return localStorage.getItem('code_hash');
  }

  //Helpers//
  private generateChatHistory(data) {
    const chatHistory = [];

    const dialogs = data.dialogs;

    for (const dialog of dialogs) {
      chatHistory.push(this.getChatInfo(data, dialog));
    }

    //console.log(chatHistory);
    //console.log(data);

    return chatHistory;
  }

  private getChatInfo(data, dialog) {
    const type = dialog.peer._;
    const id = (dialog.peer.user_id | dialog.peer.chat_id | dialog.peer.channel_id);

    let info = {
      id: id,
      type: type,
      unreadCount: dialog.unread_count,
      peerReadId: dialog.read_outbox_max_id,
      username: '',
      accessHash: '',
      title: '',
      short: '',
      lastMessage: '',
      lastMessageId: '',
      time: new Date(),
      contact: false,
      out: false,
      photo: undefined
    };
    switch (type) {
      case 'peerUser':
        for (const user of data.users) {
          if (user.id === id) {
            info.accessHash = user.access_hash;
            info.contact = user.contact;
            info.username = (user.username | user.id) as any;
            if (user.first_name) {
              info.title = user.first_name + ((user.last_name) ? ' ' + user.last_name : '');
              info.short = user.first_name[0].toUpperCase() + ((user.last_name) ? user.last_name[0].toUpperCase() : '');
            } else {
              info.title = 'Deleted User';
              info.short = 'D';
            }
            info.photo = (user.photo ? user.photo.photo_small : undefined);
            break;
          }
        }
        break;
      case 'peerChannel':
      case 'peerChat':
        for (const chat of data.chats) {
          if (chat.id === id) {
            info.accessHash = chat.access_hash;
            info.title = chat.title;
            info.username = (chat.username | chat.id) as any;
            info.short = chat.title[0].toUpperCase();
            info.photo = (chat.photo ? chat.photo.photo_small : undefined);
          }
        }
        break;
    }

    for (const message of data.messages) {
      if (message.id === dialog.top_message) {
        info.lastMessage = message.message;
        info.lastMessageId = message.id;
        info.time = new Date(message.date * 1000);
        info.out = (!!message.out);
        break;
      }
    }

    if (info.title === undefined) {
      info.title = 'Deleted';
    }
    if (info.lastMessage === '') {
      info.lastMessage = 'Media';
    }

    return info;
  }

  private generateInputPeer(chat) {
    switch (chat.type) {
      case 'peerUser':
        return {_: 'inputPeerUser', user_id: chat.id, access_hash: chat.accessHash};
      case 'peerChannel':
        return {_: 'inputPeerChannel', channel_id: chat.id, access_hash: chat.accessHash};
      case 'peerChat':
        return {_: 'inputPeerChat', chat_id: chat.id, access_hash: chat.accessHash};
    }
  }
}
