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
    this.commands.push({id: '20', code: 'DATA_DAY', title: '', description: 'Pulse counter daily data on billing hour', color: 'GREEN'});
    this.commands.push({id: '40', code: 'DATA_HOUR_DIF', title: '',description: 'Pulse counter hourly data, data accumulated on hourly basis and transmitted from jooby rf module on adjustable period', color: 'GREEN'});
    this.commands.push({id: '60', code: 'LAST_EVENTS', title: '',description: 'Last unread event', color: 'GREEN'});
    this.commands.push({id: '07', code: 'GET_CURRENT', title: '',description: 'Current pulse counter value', color: 'GREEN'});
    this.commands.push({id: '09', code: 'TIME2000', title: '',description: 'Current rf module time (time 2000 format)', color: 'GREEN'});
    this.commands.push({id: '0A', code: 'EVENTS', title: '',description: 'Critical event alarm (magnetic influence, tamper sensor, ...). Deprecated. See NEW_EVENT', color: 'GREEN'});
    this.commands.push({id: '11', code: 'GET_VERSION', title: '',description: 'Software version. Deprecated', color: 'GREEN'});
    this.commands.push({id: '14', code: 'NEW_STATUS', title: '',description: 'RF Module status', color: 'GREEN'});
    this.commands.push({id: '15', code: 'NEW_EVENT', title: '',description: 'New event occurs. Same as EVENTS but have different structure. EVENTS command will be not supported on new rf modules variants', color: 'GREEN'});
    this.commands.push({id: '16', code: 'DATA_DAY_MUL', title: '',description: 'Pulse counters daily data (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '17', code: 'DATA_HOUR_DIF_MUL', title: '',description: 'Pulse counters hourly data, data accumulated on hourly basis and transmitted from jooby module on adjustable period (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '18', code: 'GET_CURRENT_MUL', title: '',description: 'Current pulse counters value (for multi-input rf modules)', color: 'GREEN'});
    this.commands.push({id: '1E', code: 'MTX_CMD', title: '',description: 'MTX 0x1e subsystem. MTX electricity meter commands', color: 'GREEN'});

  }

  decode(): void {
    this.pkg = this.pkg.replaceAll(' ', '');
    let newStr = '';
    for(let i = 0; i < this.pkg.length; i++) {
      if (i % 2 === 0) {
        newStr += this.pkg[i] ;
        if (  (i + 1) < this.pkg.length) {
          newStr += this.pkg[i + 1] + ' ';
        }
      }
    }
    this.pkg = newStr;

    this.decodedPkg = [];
    var splits = this.pkg.split(' ');
    
    var commandInfo = this.commands.find(x => x.id == splits[0]);
    if (!commandInfo) {
      return;
    }

    //#region Command Type
    commandInfo.title = 'ბრძანების კოდი: ';
    this.decodedPkg.push(commandInfo);
    //#endregion

    //#region Package Length
    this.decodedPkg.push({id: splits[1], title: 'პაკეტის სიგრძე: ' , code: Number('0x'+splits[1]), description: 'HEX to Decimal: ' + splits[1] + ' = ' + Number('0x'+splits[1]), color: '#3498DB'});
    //#endregion

    //#region Date & Time
    const dateTimeBinary = this.hex2bin(splits[2]) + this.hex2bin(splits[3]) + this.hex2bin(splits[4]);
    const yearBinary = dateTimeBinary.slice(0, 7);
    const monthBinary = dateTimeBinary.slice(7, 11);
    const dateBinary = dateTimeBinary.slice(11, 16);
    const hoursBinary = dateTimeBinary.slice(16, 19);
    const hourBinary = dateTimeBinary.slice(19, 24);
    this.decodedPkg.push({id: splits[2] + ' ' + splits[3]+ ' ' + splits[4], code: '[წელი: ' + parseInt(yearBinary, 2) + ' ] - ' + yearBinary  + ', [თვე: ' + parseInt(monthBinary, 2) + ' ] - ' + monthBinary + ', [თარიღი: ' + parseInt(dateBinary, 2) + ' ] - '+ dateBinary + ', [საათები: ' + parseInt(hoursBinary, 2) + ' ] - ' + hoursBinary + ', [საათი: ' + parseInt(hourBinary, 2)+ ' ] - ' + hourBinary, title: 'თარიღი: ', color: '#DB3482', description: 'HEX to Binary: ' + dateTimeBinary});
    //#endregion

    //#region Channel
    this.decodedPkg.push({id: splits[5], title: 'საკომუნიკაციო არხი: ', code: Number(splits[5]), color: '#34DB3C', description: 'მიუთითებს რომელი არხი გამოიყენა მოწყობილობამ მნიშვნელობის გადმოსაცემად' })
    //#endregion

    //#region Meter Data
    this.decodedPkg.push({id: splits[6], title: 'გადმოცემული მნიშვნელობა: ', code: Number('0x'+splits[6]), color: '#6734DB', description: 'მიმდინარე მნიშვნელობა, რომელიც გადმოსცა მოწყობილობამ' })
    //#endregion

    //#region Empty blocks
    for (let i = 7; i < splits.length; i++) {
      if (Number(splits[i]) === 0) {
        this.decodedPkg.push({id: splits[i], title: '' })
      } else {
        return;
      }
    }
    //#endregion


  }

  hex2bin(hex) {
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
  }
}

export class CommandInfo {
  public id: string;
  public code: string;
  public title: string;
  public description: string;
  public color: string;

}
