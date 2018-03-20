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

const routes: Routes = [
  {
    path: '',
    component: InputComponent,
  },
  {
    path: 'index.html',
    component: AppComponent,
  }
];

// const adminRoutes: Routes = [
//   {
//     path: '',
//     component: AppComponent,
//     children: [
//       {
//         path: '',
//         canActivateChild: [AuthGuard],
//         children: [
//           { path: 'crises', component: ManageCrisesComponent },
//           { path: 'heroes', component: ManageHeroesComponent },
//           { path: '', component: AdminDashboardComponent }
//         ]
//       }
//     ]
//   }
// ];

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    WordListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [
    InputService,
    UserWordLocalStorageService,
    ContextMenu
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
