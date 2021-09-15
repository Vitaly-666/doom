import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { GameComponent } from './game/game.component';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';
import { LogoutComponent } from './logout/logout.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SETTINGS } from './server/Settings';
import { ChangePasswordComponent } from './change-password/change-password.component';

const config: SocketIoConfig = { url: `${SETTINGS.HOST}:${SETTINGS.PORT}/`, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthorizationComponent,
    GameComponent,
    RegistrationComponent,
    HeaderComponent,
    LogoutComponent,
    RoomsComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([
      {path: 'game', component: GameComponent},
      {path: 'authorization', component: AuthorizationComponent},
      {path: 'registration', component: RegistrationComponent},
      {path: 'rooms', component: RoomsComponent},
      {path: 'change-password', component: ChangePasswordComponent},
      {path: '', redirectTo: '/authorization', pathMatch: 'full'},
      {path: '**', redirectTo: '/authorization', pathMatch: 'full'}
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})



export class AppModule { }
