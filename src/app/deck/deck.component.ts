import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import GUN, {IGunChain, IGunInstance} from "gun";


@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data:string, public dialogRef: MatDialogRef<DeckComponent>) {

    console.log(this.gun.get("decks").get(this.data), this.gun.get(`decks/${this.data}`))

    this.gDeck = this.gun.get("decks").get(this.data)

    this.gDeck.on((data,key)=>{
      console.log(data)
      data.uuid = key
      this.deck = data
    })

    this.gMaterials.map().on((data,key)=>{
      this.materials = this.materials.filter(e => e.uuid !== key)
      if(data !== null) {
        data.uuid = key
        this.materials.push(data)
      }
    })
    this.gCards.map().on((data,key)=>{
      this.cards = this.cards.filter(e => e.uuid !== key)
      if(data !== null) {
        data.uuid = key
        this.cards.push(data)
      }
    })
    this.gDecks.map().on((data,key)=>{
      this.decks = this.decks.filter(e => e.uuid !== key)
      if(data !== null) {
        data.uuid = key
        this.decks.push(data)
      }
    })


  }
  gun = GUN(['http://139-162-135-50.ip.linodeusercontent.com:8765/gun'])
  gDeck: IGunChain<any, IGunChain<any, IGunInstance<any>, IGunInstance<any>, string>, IGunInstance<any>, string> = this.gun.get(`decks/${this.data}`)

  deck = {name:"Lädt...", uuid: this.data}

  decks: any[] = [];
  cards: any[] = [];
  materials: any[] = [];

  gMaterials = this.gDeck.get("materials")
  gCards = this.gDeck.get("cards")
  gDecks = this.gDeck.get("decks")

  onClose(): void {
    this.dialogRef.close();
  }



}
