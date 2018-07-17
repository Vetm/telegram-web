import { Injectable } from '@angular/core';

@Injectable()
export class ColorGeneratorService {

  constructor() { }

  public generateColor(object) {
    const MIXED_WEIGHT = 0.75;
    const TEXT_WEIGHT = 0.25;
    const SEED = 16777215;
    const FACTOR = 49979693;

    const text = String(JSON.stringify(object));
    let mixed;
    let b = 1;
    let d = 0;
    let f = 1;
    if (text.length > 0) {
      for (let i = 0; i < text.length; i++)
        text[i].charCodeAt(0) > d && (d = text[i].charCodeAt(0)), f = parseInt((SEED / d) + ''),
          b = (b + text[i].charCodeAt(0) * f * FACTOR) % SEED;
    }
    let hex = (b * text.length % SEED).toString(16);
    hex = hex.padEnd(6, hex);
    let rgb = this.hexToRgb(hex);
    if(mixed)
      return this.rgbToHex(TEXT_WEIGHT * rgb[0] + MIXED_WEIGHT * mixed[0], TEXT_WEIGHT * rgb[1] + MIXED_WEIGHT * mixed[1],
        TEXT_WEIGHT * rgb[2] + MIXED_WEIGHT * mixed[2]);
    return hex;
  }

  private rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  private hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

}
