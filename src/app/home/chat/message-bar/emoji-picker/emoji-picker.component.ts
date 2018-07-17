import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {emojis} from './emoji-data';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
  animations: [
    trigger('state', [
      state('inactive', style({
        display: 'none',
        opacity: 0
      })),
      state('active', style({
        display: 'block',
        opacity: 1
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class EmojiPickerComponent implements OnInit {

  @Output() emoji = new EventEmitter();

  public state = 'inactive';
  public emojis = emojis;
  public currentCategory = 'smileys';

  private hideTimeout;

  constructor() {
  }

  ngOnInit() {
  }

  changeCategory(categoryName) {
    this.currentCategory = categoryName;
  }

  pickEmoji(emoji) {
    this.emoji.emit(emoji.char);
  }

  show() {
    clearTimeout(this.hideTimeout);
    this.state = 'active';
  }

  hide(timeout = 250) {
    this.hideTimeout = setTimeout(() => {
      this.state = 'inactive';
    }, timeout);
  }

}
