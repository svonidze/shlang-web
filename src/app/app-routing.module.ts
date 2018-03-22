import { InputComponent } from './components/input.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings.component';

const routes: Routes = [
    { path: '', component: InputComponent },
    { path: 'index.html', redirectTo: '', pathMatch: 'full' },
    { path: 'settings', component: SettingsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
