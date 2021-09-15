import { Component, OnInit } from '@angular/core';
import { ServerService } from '../server.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  login = '';
  oldPassword = '';
  newPassword = '';

  EVENTS = this.serverService.getEvents();

  constructor(
    private serverService: ServerService,
    ) {
    serverService.on(this.EVENTS.PASSWORD_CHANGED, (data: any) => this.onChangePassword(data))
  }

  ngOnInit(): void {
  }

  onChangePassword(result: boolean) {
    if (result) {
      console.log('Пароль изменен');
    }
  } 

  changePassword() {
    this.serverService.changePassword(this.login, this.oldPassword, this.newPassword);
  }
}
