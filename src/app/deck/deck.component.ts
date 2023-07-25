import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import GUN, {IGunChain, IGunInstance} from "gun";
import {GunService} from "../gun.service";
import {TypesService} from "../types.service";


@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {
  listeners: any[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, uuid: string }[],
    public dialogRef: MatDialogRef<DeckComponent>,
    public gunService: GunService,
    public typesService:TypesService,
    private changeDirectorRef: ChangeDetectorRef) {
    this.path = [...this.data]
    let uuid: string = this.data[this.data.length - 1].uuid
    let tmp = this.gun.get("decks").get(this.data[0].uuid)

    if (this.data.length > 1) {
      for (let i = 1; i < this.data.length; i++) {
        tmp = tmp.get("decks").get(this.data[i].uuid)
      }
    }



    this.gDeck = tmp

    this.gDecks = this.gDeck.get("decks")
    this.gCards = this.gDeck.get("cards")
    this.gMaterials = this.gDeck.get("materials")

    this.gDeck.on((data, key) => {
      console.log("gDeckOn", data, key)
      data.uuid = key
      this.deck = data
      this.path[this.path.length - 1] = {name: data.name, uuid: key}
    })

    this.gMaterials.map().on((data, key, _msg, _ev) => {
      this.listeners.push(_ev)
      this.materials = this.materials.filter(e => e.uuid !== key)
      if (data !== null) {
        data.uuid = key
        this.materials.push(data)
      }
    })
    this.gCards.map().on((data, key, _msg, _ev) => {
      this.listeners.push(_ev)
      this.cards = this.cards.filter(e => e.uuid !== key)
      if (data !== null) {
        data.uuid = key
        this.cards.push(data)
      }
    })
    this.gDecks.map().on((data, key, _msg, _ev) => {
      this.listeners.push(_ev)
      this.decks = this.decks.filter(e => e.uuid !== key)
      if (data !== null) {
        data.uuid = key
        this.decks.push(data)
      }
    })


  }
  updateName(){
    setTimeout(()=> {
      this.gDeck.put({name: this.path[this.path.length - 1].name})
    },10)
  }

  gun = this.gunService.get()
  gDeck: IGunChain<any, IGunChain<any, IGunInstance<any>, IGunInstance<any>, "decks">, IGunInstance<any>, string> = this.gun.get(`decks/${this.data}`)

  path: { name: string, uuid: string }[] = [{name: "Lädt...", uuid: ""}]
  deck = {name: "Lädt...", uuid: this.data}

  decks: any[] = [];
  cards: any[] = [];
  materials: any[] = [];

  addNewDeck() {
    if (this.newDeckName !== "")
      this.gDecks.set({name: this.newDeckName})
    this.newDeckName = "";
  }

  remove(key: string) {
    this.gDecks.get(key).put(null)
    this.decks = this.decks.filter(e => e.uuid !== key)

  }

  removeMat(key: string) {
    this.gMaterials.get(key).put(null)
    this.materials = this.materials.filter(e => e.uuid !== key)
  }

  removeCard(key: string) {
    this.gCards.get(key).put(null)
    this.cards = this.cards.filter(e => e.uuid !== key)
  }

  types = this.typesService.get(true,()=>{this.types = this.typesService.get(true,undefined); console.log(this.types)})


  newDeckName: string = ""
  newMatName: string = ""
  newMatLink: string = ""


  addNewMat() {
    if (this.newMatLink !== "" && this.newMatName !== "") {
      this.gMaterials.set({name: this.newMatName, link: this.newMatLink})
    }
    this.newMatLink = ""
    this.newMatName = ""
  }

  addNewCard() {

    this.gCards.set({fields:this.newCardFields,type:this.newCardType})
    this.newCardFields = [];
  }

  newCardType: string = "basic"
  newCardFields:string[] = []

  gMaterials = this.gDeck.get("materials")
  gCards = this.gDeck.get("cards")
  gDecks = this.gDeck.get("decks")

  onClose(): void {
    this.dialogRef.close();
  }

  openDeck(uuid: string, back: boolean) {
    let newPath: { name: string, uuid: string }[] = []
    if (!back) {
      newPath = [...this.path]
      newPath.push({name: "Lädt...", uuid: uuid})
    } else {
      for (let p of this.path) {
        newPath.push(p)
        if (p.uuid == uuid)
          break
      }
    }
    return newPath

  }


}
