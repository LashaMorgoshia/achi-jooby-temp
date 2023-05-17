import { Component } from '@angular/core';
// import { directions } from 'jooby-codec/analog/constants';
// export * as commands from './commands/index.js';
// export * as message from './utils/message.js';
// export * as utils from './utils/index.js';
// export * as constants from './constants/index.js';

import { commands, message, constants } from 'jooby-codec'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  commands: CommandInfo[];
  pkg = '17 0c 00 66 f1 01 44 00 00 00 00 00 00 00 62 3b 00 c5';
  decodedPkg = [];

  constructor() {
    this.commands = [];
    this.commands.push({id: '20', code: 'DATA_DAY', description: 'Pulse counter daily data on billing hour', color: 'GREEN'});
    this.commands.push({id: '40', code: 'DATA_HOUR_DIF', description: 'Pulse counter hourly data, data accumulated on hourly basis and transmitted from jooby rf module on adjustable period', color: 'GREEN'});
    this.commands.push({id: '60', code: 'LAST_EVENTS', description: 'Last unread event', color: 'GREEN'});
    this.commands.push({id: '07', code: 'GET_CURRENT', description: 'Current pulse counter value', color: 'GREEN'});
    this.commands.push({id: '09', code: 'TIME2000', description: 'Current rf module time (time 2000 format)', color: 'GREEN'});
    this.commands.push({id: '0A', code: 'EVENTS', description: 'Critical event alarm (magnetic influence, tamper sensor, ...). Deprecated. See NEW_EVENT', color: 'GREEN'});
    this.commands.push({id: '11', code: 'GET_VERSION', description: 'Software version. Deprecated', color: 'GREEN'});
    this.commands.push({id: '14', code: 'NEW_STATUS', description: 'RF Module status', color: 'GREEN'});
    this.commands.push({id: '15', code: 'NEW_EVENT', description: 'New event occurs. Same as EVENTS but have different structure. EVENTS command will be not supported on new rf modules variants', color: 'GREEN'});
    this.commands.push({id: '16', code: 'DATA_DAY_MUL', description: 'Pulse counters daily data (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '17', code: 'DATA_HOUR_DIF_MUL', description: 'Pulse counters hourly data, data accumulated on hourly basis and transmitted from jooby module on adjustable period (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '18', code: 'GET_CURRENT_MUL', description: 'Current pulse counters value (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '1E', code: 'MTX_CMD', description: 'MTX 0x1e subsystem. MTX electricity meter commands', color: 'GREEN'});

  }

  decode(): void {
    this.decodedPkg = [];
    var splits = this.pkg.split(' ');
    
    var commandInfo = this.commands.find(x => x.id == splits[0]);
    if (!commandInfo) {
      return;
    }

    this.decodedPkg.push(commandInfo);

    this.decodedPkg.push({id: splits[1], code: Number('0x'+splits[1]), description: 'პაკეტის სიგრძე', color: 'Orange'});
  }

  hex2bin(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
  }

  getBytes(hex: any): Uint8Array {
    let cleanHex = hex.replace(/\s+|0x/g, '');
    
    // correct wrong input
    if (cleanHex.length % 2 !== 0) {
      cleanHex = `0${cleanHex}`;
    }

    console.log(cleanHex);
    const resultLength = cleanHex.length / 2;
    const result = new Uint8Array(resultLength);
    console.log(result);
    for (let index = 0; index < resultLength; index++) {
      result[index] = parseInt(cleanHex.substring(index * 2, index * 2 + 2), 16);
    }
    return result;
  }

}

export class LineInfo {
  public id: number;
  public command: CommandInfo;
  public color: string;
}

export class CommandInfo {
  public id: string;
  public code: string;
  public description: string;
  public color: string;
}
