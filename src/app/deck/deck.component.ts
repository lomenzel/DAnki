import {Component, Inject, ChangeDetectorRef, OnInit} from '@angular/core';
import GUN, {IGunChain, IGunInstance} from "gun";
import {GunService} from "../gun.service";
import {TypesService} from "../types.service";
import {Router} from "@angular/router";
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent {
  listeners: any[] = []
  data: any[] = []

  constructor(
    public gunService: GunService,
    public typesService: TypesService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDirectorRef: ChangeDetectorRef) {
    this.route.paramMap.subscribe(params => {
      const jsonData = params.get('path');
      try {
        if (jsonData) {
          this.data = JSON.parse(jsonData);
        }
        else{
          console.log("wtf",jsonData)
        }
        this.path = this.data
        //let uuid: string = this.data[this.data.length - 1].uuid
        let tmp = this.gun.get("decks").get(this.data[0].uuid)
        tmp.on((data,key,_msg,_ev)=>{
          this.listeners.push(_ev)
          this.path[0] = {name:data.name,uuid:key,deleted:data.deleted}
        })

        if (this.data.length > 1) {
          for (let i = 1; i < this.data.length; i++) {
            tmp = tmp.get("decks").get(this.data[i].uuid)
            tmp.on((data,key,_msg,_ev)=>{
              this.listeners.push(_ev)
              this.path[i] = {name:data.name,uuid:key, deleted:data.deleted}
            })
          }
        }


        this.gDeck = tmp

        this.gDecks = this.gDeck.get("decks")
        this.gCards = this.gDeck.get("cards")
        this.gMaterials = this.gDeck.get("materials")

        this.gDeck.on((data, key,_msg,_ev) => {
          //console.log("gDeckOn", data, key)
          this.listeners.push(_ev)
          data.uuid = key
          this.deck = data
          //this.path[this.path.length - 1] = {name: data.name, uuid: key}
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
          if (data !== null && !data.deleted) {
            data.uuid = key

            try {
              this.cards.push({...data, fields: JSON.parse(data.fields)})
            } catch (e) {
              console.error(e)
            }
          }
        })
        this.gDecks.map().on((data, key, _msg, _ev) => {
          this.listeners.push(_ev)
          this.decks = this.decks.filter(e => e.uuid !== key)
          if (data !== null && !data.deleted) {
            data.uuid = key
            this.decks.push(data)
          }
        })
      } catch (e) {
        console.error("incorrect path",e)
        this.router.navigate([""])
      }
      console.log("path: ", this.data); // Hier hast du den geparsten JSON-Wert
    });

  }

  updateName() {
    setTimeout(() => {
      this.gDeck.put({name: this.path[this.path.length - 1].name})
    }, 10)
  }

  gun = this.gunService.get()
  gDeck: IGunChain<any, IGunChain<any, IGunInstance<any>, IGunInstance<any>, "decks">, IGunInstance<any>, string> = this.gun.get(`decks/${this.data}`)

  path: { name: string, uuid: string, deleted:true|false|undefined }[] = [{name: "Lädt...", uuid: "",deleted:false}]
  deck = {name: "Lädt...", uuid: ""}

  decks: any[] = [];
  cards: any[] = [];
  materials: any[] = [];

  addNewDeck() {
    if (this.newDeckName !== "")
      this.gDecks.set({name: this.newDeckName})
    this.newDeckName = "";
  }

  remove(key: string) {
    this.gDecks.get(key).put({deleted:true})
    //this.decks = this.decks.filter(e => e.uuid !== key)

  }

  removeMat(key: string) {
    this.gMaterials.get(key).put(null)
    this.materials = this.materials.filter(e => e.uuid !== key)
  }

  removeCard(key: string) {
    this.gCards.get(key).put({deleted:true})
    this.cards = this.cards.filter(e => e.uuid !== key)
  }

  types = this.typesService.get(true, () => {
    this.types = this.typesService.get(true, undefined)
  })


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

    this.gCards.set({fields: JSON.stringify(this.newCardFields), type: this.newCardType})
    this.newCardFields = [];
  }

  newCardType: string = "basic"
  newCardFields: string[] = []

  gMaterials = this.gDeck.get("materials")
  gCards = this.gDeck.get("cards")
  gDecks = this.gDeck.get("decks")


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
    this.removeListeners()
    this.decks = [];
    this.cards = [];
    this.materials = [];
    this.deck = {uuid: "", name:""}

    console.log(JSON.stringify(newPath))
    this.router.navigate(["/deck", JSON.stringify(newPath)])

  }
  removeListeners() {
    this.listeners.forEach(listener => listener.off());
    this.listeners = [];
  }


}
