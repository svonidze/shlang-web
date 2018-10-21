import { ConsoleLoggerService } from './logging/console-logger.service';
import { HtmlParser } from './components/html-parser';
import { AppRoutingModule } from './app-routing.module';
import { WordListComponent } from './components/word-list.component';
import { InputService } from './services/input.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContextMenu } from './chrome/contextMenus';
import { InputComponent } from './components/input.component';
import { AppComponent } from './components/app.component';
import { UserWordLocalStorageService } from './services/user-word-local-storage.service';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { SettingsComponent, GoogleDriveApi } from './components/settings.component';
import { LoggerService } from './logging/logger.service';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    WordListComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
  ],
  exports: [RouterModule],
  providers: [
    InputService,
    UserWordLocalStorageService,
    ContextMenu,
    HtmlParser,
    { provide: LoggerService, useClass: ConsoleLoggerService },
    GoogleDriveApi
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
