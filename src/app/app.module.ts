import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule} from '@angular/material/button';
import { OverviewComponent } from './overview/overview.component'
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatFormFieldModule} from '@angular/material/form-field'
import {MatSelectModule} from '@angular/material/select';
import { MenuComponent } from './menu/menu.component';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from '@angular/material/input';
import { DeckComponent } from './deck/deck.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatChipsModule} from "@angular/material/chips";
import {MatExpansionModule} from '@angular/material/expansion';
import { NotetypesComponent } from './notetypes/notetypes.component';
import { SettingsComponent } from './settings/settings.component';
import { CardViewComponent } from './card/card-view/card-view.component';
import { CardEditComponent } from './card/card-edit/card-edit.component';
import { CardPreviewComponent } from './card/card-preview/card-preview.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import { DownloadComponent } from './download/download.component';


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    MenuComponent,
    DeckComponent,
    NotetypesComponent,
    SettingsComponent,
    CardViewComponent,
    CardEditComponent,
    CardPreviewComponent,
    DownloadComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatChipsModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
