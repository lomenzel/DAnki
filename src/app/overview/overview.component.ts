import {Component, ChangeDetectorRef} from '@angular/core';
import GUN from "gun"
import {MatDialog} from "@angular/material/dialog";
import {DeckComponent} from "../deck/deck.component";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  gun = GUN(['http://139-162-135-50.ip.linodeusercontent.com:8765/gun'])
  gDecks = this.gun.get("decks")


  constructor(private changeDirectorRef: ChangeDetectorRef,public dialog:MatDialog) {
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

  openDialog(deckUuid:string){
    const dialogRef = this.dialog.open(DeckComponent, {data:deckUuid})
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`)
    })
  }


  remove(key: string) {
    this.gDecks.get(key).put(null)
    this.decks = this.decks.filter(e => e.uuid !== key)
    this.changeDirectorRef.detectChanges()
  }

  add() {
    if(this.newName !== "") {
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

