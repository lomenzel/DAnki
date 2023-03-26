import {Component, ChangeDetectorRef} from '@angular/core';
import GUN from "gun"
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeckComponent} from "../deck/deck.component";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  gun = GUN(['https://139-162-135-50.ip.linodeusercontent.com:8765/gun','https://gun-manhattan.herokuapp.com/gun'])
  gDecks = this.gun.get("decks")


  constructor(private changeDirectorRef: ChangeDetectorRef, public dialog: MatDialog) {
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

    const dialogConfig = new MatDialogConfig()

    dialogConfig.maxWidth = "30cm"
    dialogConfig.width = "80vw"
    dialogConfig.data = path

    const dialogRef = this.dialog.open(DeckComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(result => {
     console.log(`Dialog result: `, result)
      if(result !== undefined){
        this.openDialog(result)
      }
    })
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

