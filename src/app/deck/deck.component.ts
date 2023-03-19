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

    this.gDeck = this.gun.get("decks").get(this.data)
    this.gDecks = this.gDecks.get("decks")
    this.gCards = this.gDeck.get("cards")
    this.gMaterials = this.gDeck.get("materials")

    this.gDeck.on((data,key)=>{

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

  addNewDeck(){
    if(this.newDeckName !== "")
    this.gDecks.set({name:this.newDeckName})
    this.newDeckName = "";
  }
  remove(key: string) {
    this.gDecks.get(key).put(null)
    this.decks = this.decks.filter(e => e.uuid !== key)

  }
  removeMat(key:string) {
    this.gMaterials.get(key).put(null)
    this.materials = this.materials.filter(e=> e.uuid !==key)
  }
  removeCard(key:string){
    this.gCards.get(key).put(null)
    this.cards = this.cards.filter(e => e.uuid !== key)
  }


  newDeckName:string= ""
  newMatName:string= ""
  newMatLink:string= ""


  addNewMat(){
    if(this.newMatLink !== "" && this.newMatName !== ""){
      this.gMaterials.set({name:this.newMatName, link:this.newMatLink})
    }
    this.newMatLink = ""
    this.newMatName =""
  }

  addNewCard(){
    if(this.newCardType === "basic"){
      if(this.newCardQuestion !== "" && this.newCardAnswer !== ""){
        this.gCards.set({answer:this.newCardAnswer,question:this.newCardQuestion,type : this.newCardType})
        this.newCardAnswer = ""
        this.newCardQuestion = ""
      }
    }
    if(this.newCardType === "cloze"){
      if(this.newCardText !==""){
        this.gCards.set({text:this.newCardText,type:this.newCardType})
        this.newCardText = ""
      }
    }
  }

  newCardType:string = "basic"
  newCardAnswer:string =""
  newCardQuestion:string = ""
  newCardText:string = ""

  gMaterials = this.gDeck.get("materials")
  gCards = this.gDeck.get("cards")
  gDecks = this.gDeck.get("decks")

  onClose(): void {
    this.dialogRef.close();
  }



}
