import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NotetypesComponent} from "./notetypes/notetypes.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private dialog: MatDialog) {
  }
  openNoteTypesDialog(){
    const d = this.dialog.open(NotetypesComponent)
  }
}
