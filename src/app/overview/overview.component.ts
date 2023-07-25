import {Component, ChangeDetectorRef} from '@angular/core';
import GUN from "gun"
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {GunService} from "../gun.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  gun = this.gunService.get()
  gDecks = this.gun.get("decks")


  constructor(public router:Router,private changeDirectorRef: ChangeDetectorRef, public dialog: MatDialog, public gunService:GunService) {
    console.log(this.gDecks)

    this.gDecks.map().on((data, key) => {


      this.decks = this.decks.filter(e => e.uuid !== key)
      if (data != null) {
        data.uuid = key
        this.decks.push(data)
      }
      //this.changeDirectorRef.detectChanges()
    })

    //this.gDecks.set({name: "GUN"})
  }

  openDialog(path: {name:string,uuid:string}[]) {
    this.router.navigate(["/deck", JSON.stringify(path)])
  }


  remove(key: string) {
    this.gDecks.get(key).put(null)
    this.decks = this.decks.filter(e => e.uuid !== key)
    this.changeDirectorRef.detectChanges()
  }

  add() {
    if (this.newName !== "") {
      this.gDecks.set({name: this.newName})
      this.newName = ""
    }
  }

  newName = ''

  decks: { name: string, uuid: string }[] = []
  filter = {
    path: "Blablabla"
  }
}

