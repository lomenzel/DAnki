import {Injectable} from '@angular/core';
import {CrowdAnkiBaseDeckModel} from "./crowdAnkiBaseDeck.model";
import {CrowdAnkiDeckModel} from "./crowdAnkiDeck.model";
import {GunService} from "./gun.service";
import {IGunChain} from "gun";
import {CrowdAnkiNoteModel} from "./crowdAnkiNote.model";

interface RawDeck {
  //material:{name:string,href:string}[],
  decks: RawDeck[],
  cards: DeckCard[]
  uuid: string
  name: string;
}

interface DeckCard {
  path: Path[],
  uuid: string
}

interface Path {
  name: string,
  uuid: string
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private gunService: GunService) {
  }

  async download(path: { name: string, uuid: string }[]): Promise<void> {
    console.log("Deck:" + JSON.stringify(this.makeBaseDeck(this.makeCrowdankiDeck( await this.getRawDeck(this.getGunBase(path), path)))))
    this.downloadFile(this.makeTextFile(JSON.stringify(this.makeBaseDeck(this.makeCrowdankiDeck( await this.getRawDeck(this.getGunBase(path), path))))))

  }


  makeCrowdankiDeck(deck: RawDeck): CrowdAnkiDeckModel {
    return {
      "__type__": "Deck",
      "children": deck.decks.map(e => this.makeCrowdankiDeck(e)),
      "crowdanki_uuid": deck.uuid,
      "deck_config_uuid": "58b6fa76-a586-11ed-a34c-9bbd37c88a3c",
      "desc": "",
      "dyn": 0,
      "extendNew": 0,
      "extendRev": 0,
      "media_files": [],
      "name": deck.name,
      "newLimit": null,
      "newLimitToday": null,
      "notes": deck.cards.map(e => this.makeCrowdankiNote(e)),
      "reviewLimit": null,
      "reviewLimitToday": null
    }
  }

  makeCrowdankiNote(card:DeckCard):CrowdAnkiNoteModel{
    return {
      __type__:"Note",
      fields:[JSON.stringify(card.path),card.uuid],
      guid:"",
      note_model_uuid:this.ankitubeNodeModelUuid,
      tags:["ankitube"]
    }
  }
  getGunBase(path: Path[]): IGunChain<any> {
    let tmp = this.gun.get("decks").get(path[0].uuid)
    if (path.length > 1) {
      for (let i = 1; i < path.length; i++) {
        tmp = tmp.get("decks").get(path[i].uuid)
      }
    }
    return tmp
  }

  /*
  getRawDeck(gun:IGunChain<any>,path:Path[]):RawDeck{
    //TODO deal with async
    let deck:RawDeck= {cards:[],decks:[],uuid:"",name:"",}
    gun.once((data,key)=>{
      deck.uuid = key
      deck.name = data.name
    })
    gun.get("cards").map().once((data,key)=>{
      deck.cards.push({path:path,uuid:key})
    })
    gun.get("decks").map().once((data,key)=>{
      let  newPath = [...path]
      newPath.push({uuid:key,name:data.name})
      deck.decks.push(this.getRawDeck(gun.get("decks").get(key),newPath))
    })
    return deck
  }

   */


  //ChatGPTs versuch:
  async getRawDeck(gun: IGunChain<any>, path: Path[]): Promise<RawDeck> {
    const deck: RawDeck = {cards: [], decks: [], uuid: "", name: ""};

    // Wrap the first async operation in a Promise to handle asynchronously
    await new Promise<void>((resolve) => {
      gun.once((data, key) => {
        deck.uuid = key;
        deck.name = data.name;
        resolve(); // Resolve the promise once the data is retrieved
      });
    });

    // Wrap the map() operation in a Promise to handle asynchronously
    deck.cards = await new Promise<DeckCard[]>((resolve) => {
      const cards: DeckCard[] = [];
      gun.get("cards").map().once((data, key) => {
        cards.push({path: path, uuid: key});
      }).once(() => resolve(cards));
    });

    // Wrap the map() operation for sub-decks in a Promise to handle asynchronously
    deck.decks = await new Promise<RawDeck[]>((resolve) => {
      const decks: RawDeck[] = [];
      gun.get("decks").map().once((data, key) => {
        const newPath = [...path];
        newPath.push({uuid: key, name: data.name});
        this.getRawDeck(gun.get("decks").get(key), newPath).then((subDeck) => {
          decks.push(subDeck);
        });
      }).once(() => resolve(decks));
    });

    return deck; // Return the fully assembled "deck" object
  }


  gun = this.gunService.get()

  makeBaseDeck(deck: CrowdAnkiDeckModel): CrowdAnkiBaseDeckModel {
    return {...this.exampleDeck, "children": [deck]}

  }

  downloadFile(fileURL: string) {
    let link = document.createElement('a');
    link.href = fileURL;
    link.download = "deck.json";
    link.click();
  }

  makeTextFile(text: string) {
    let data = new Blob([text], {type: 'plain/text'});
    return window.URL.createObjectURL(data);
  }

  ankitubeNodeModelUuid = "ae7d8d10-2d28-11ee-a20a-072d319e12c7"

  exampleDeck: CrowdAnkiBaseDeckModel = {
    "__type__": "Deck",
    "children": [
      {
        "__type__": "Deck",
        "children": [],
        "crowdanki_uuid": "ae7d7f1e-2d28-11ee-a20a-072d319e12c7",
        "deck_config_uuid": "58b6fa76-a586-11ed-a34c-9bbd37c88a3c",
        "desc": "",
        "dyn": 0,
        "extendNew": 0,
        "extendRev": 0,
        "media_files": [],
        "name": "TestDeck",
        "newLimit": null,
        "newLimitToday": null,
        "notes": [
          {
            "__type__": "Note",
            "fields": [
              "%5B%7B\"name\":\"Test%20Deck\",\"uuid\":\"lkjxr45tBPcD2HCrt0bL\"%7D%5D",
              "lkjxv193rnIIkjbvaj0m"
            ],
            "guid": "e0n4Ounm,b",
            "note_model_uuid": "ae7d8d10-2d28-11ee-a20a-072d319e12c7",
            "tags": []
          }
        ],
        "reviewLimit": null,
        "reviewLimitToday": null
      }
    ],
    "crowdanki_uuid": "ae7d6790-2d28-11ee-a20a-072d319e12c7",
    "deck_config_uuid": "58b6fa76-a586-11ed-a34c-9bbd37c88a3c",
    "deck_configurations": [
      {
        "__type__": "DeckConfig",
        "autoplay": true,
        "buryInterdayLearning": true,
        "crowdanki_uuid": "58b6fa76-a586-11ed-a34c-9bbd37c88a3c",
        "dyn": false,
        "interdayLearningMix": 0,
        "lapse": {
          "delays": [
            10.0
          ],
          "leechAction": 1,
          "leechFails": 8,
          "minInt": 1,
          "mult": 0.0
        },
        "maxTaken": 60,
        "name": "Default",
        "new": {
          "bury": true,
          "delays": [
            1.0,
            10.0
          ],
          "initialFactor": 2500,
          "ints": [
            1,
            4,
            0
          ],
          "order": 1,
          "perDay": 10,
          "separate": true
        },
        "newGatherPriority": 1,
        "newMix": 1,
        "newPerDayMinimum": 0,
        "newSortOrder": 0,
        "replayq": true,
        "rev": {
          "bury": true,
          "ease4": 1.3,
          "fuzz": 0.05,
          "hardFactor": 1.2,
          "ivlFct": 1.0,
          "maxIvl": 36500,
          "minSpace": 1,
          "perDay": 9999
        },
        "reviewOrder": 0,
        "timer": 0
      }
    ],
    "desc": "",
    "dyn": 0,
    "extendNew": 0,
    "extendRev": 0,
    "media_files": [],
    "name": "AnkiTube",
    "newLimit": null,
    "newLimitToday": null,
    "note_models": [
      {
        "__type__": "NoteModel",
        "crowdanki_uuid": "ae7d8d10-2d28-11ee-a20a-072d319e12c7",
        "css": ".card {\n    font-family: arial;\n    font-size: 20px;\n    text-align: center;\n    color: black;\n    background-color: white;\n}\n",
        "flds": [
          {
            "collapsed": false,
            "description": "",
            "excludeFromSearch": false,
            "font": "Liberation Sans",
            "name": "path",
            "ord": 0,
            "plainText": false,
            "rtl": false,
            "size": 20,
            "sticky": false
          },
          {
            "collapsed": false,
            "description": "",
            "excludeFromSearch": false,
            "font": "Arial",
            "name": "uuid",
            "ord": 1,
            "plainText": false,
            "rtl": false,
            "size": 20,
            "sticky": false
          }
        ],
        "latexPost": "\\end{document}",
        "latexPre": "\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n",
        "latexsvg": false,
        "name": "AnkiTube",
        "originalStockKind": 1,
        "req": [
          [
            0,
            "none",
            []
          ]
        ],
        "sortf": 0,
        "tmpls": [
          {
            "afmt": "{{FrontSide}}\n\n<hr id=answer>\n\n{{uuid}}",
            "bafmt": "",
            "bfont": "",
            "bqfmt": "",
            "bsize": 0,
            "did": null,
            "name": "Karte 1",
            "ord": 0,
            "qfmt": "{{path}}"
          }
        ],
        "type": 0
      }
    ],
    "notes": [],
    "reviewLimit": null,
    "reviewLimitToday": null
  }

}
