import { Component, Injectable, OnInit } from '@angular/core';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ChatComponent implements OnInit {

  EVENTS = this.serverService.getEvents();

  constructor(private serverService: ServerService) {
    serverService.on(this.EVENTS.GET_MESSAGE, (data: any) => this.getMessage(data));
    serverService.on(this.EVENTS.USER_ENTER_CHAT, (name: String) => this.whenUserEntered(name));
    serverService.on(this.EVENTS.USER_LEAVE_CHAT, (name: String) => this.whenUserLeaved(name));
  }

  ngOnInit(): void {
  }

  message = "";
  chat = "";

  sendMessage() {
    this.serverService.sendMessage(this.message);
  }

  getMessage(data: any) {
    if (data.message && data.name) {
        this.chat += data.name + ': ' + data.message + '\n';
    };
  }

  whenUserEntered(name: String) {
    if (name) {
      this.chat += "Пользователь: " + name + '\n' + "Вошёл в чат! \n";
    };
  }

  whenUserLeaved(name: String) {
    if (name) {
      this.chat += "Пользователь: " + name + '\n' + "Покинул в чат! \n";
    };
  }
  
}
