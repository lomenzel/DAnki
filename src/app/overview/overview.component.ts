import {Component, ChangeDetectorRef} from '@angular/core';
import GUN from "gun"
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

import {GunService} from "../gun.service";
import {Router} from "@angular/router";
import {DownloadComponent} from "../download/download.component";
import {DownloadService} from "../download.service";
import {SettingsService} from "../settings.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  gun = this.gunService.get()
  gDecks = this.gun.get("decks")


  constructor(public router: Router,
              private changeDirectorRef: ChangeDetectorRef,
              private settingsService:SettingsService,
              public dialog: MatDialog,
              public downloadService:DownloadService,
              public gunService: GunService) {
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

  openDialog(path: { name: string, uuid: string }[]) {
    this.router.navigate(["/deck", JSON.stringify(path)])
  }


  remove(key: string) {
    this.gDecks.get(key).put({deleted: true})
    this.decks = this.decks.filter(e => e.uuid !== key)
    //this.changeDirectorRef.detectChanges()
  }
  restoreDeck(key:string){
    this.gDecks.get(key).put({deleted:false}).once((data, key) => {


      this.decks = this.decks.filter(e => e.uuid !== key)
      if (data != null) {
        data.uuid = key
        this.decks.push(data)
      }
      //this.changeDirectorRef.detectChanges()
    })

  }

  add() {
    if (this.newName !== "") {
      this.gDecks.set({name: this.newName})
      this.newName = ""
    }
  }

  newName = ''

  decks: { name: string, uuid: string ,downloading:boolean, deleted:boolean}[] = []
  filter = {
    path: "Blablabla"
  }

  openDownloadDialog(deck: { name: string, uuid: string }) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig()
    dialogConfig.data = {path: [], deck: deck}
    this.dialog.open(DownloadComponent, dialogConfig)
  }

  download(deck: { name: string, uuid: string,downloading:boolean }): void {
    deck.downloading = true
    this.downloadService.download([deck]).then(e =>{
      deck.downloading = false
    })
  }
  restore:boolean = this.settingsService.getRestore();

  privateDecks:{uuid:string,name:string,downloading:boolean}[] = []
}

