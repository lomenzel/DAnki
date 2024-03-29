import {Injectable} from '@angular/core';
import {CrowdAnkiBaseDeckModel} from "./crowdAnkiBaseDeck.model";
import {CrowdAnkiDeckModel} from "./crowdAnkiDeck.model";
import {GunService} from "./gun.service";
import {IGun, IGunChain} from "gun";
import {CrowdAnkiNoteModel} from "./crowdAnkiNote.model";


interface RawDeck {
  //material:{name:string,href:string}[],
  decks: RawDeck[],
  cards: DeckCard[]
  uuid: string
  name: string;
}
interface Location {
  path:Path[],
  private:boolean
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

  async download(location: Location): Promise<boolean> {
    //console.log("START: Download")
    //console.log("Deck:", await this.getRawDeck(this.getGunBase(path), path))
    this.downloadFile(this.makeTextFile(JSON.stringify(this.makeBaseDeck(this.makeCrowdankiDeck(await this.getRawDeck(this.gunService.getGunBase(location), location))))))
    //console.log("END: Download")
    return true;
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

  makeCrowdankiNote(card: DeckCard): CrowdAnkiNoteModel {
    return {
      __type__: "Note",
      fields: [encodeURIComponent(JSON.stringify(card.path)), card.uuid],
      guid: card.uuid,
      note_model_uuid: this.dankiNodeModelUuid,
      tags: ["DAnki"]
    }
  }




  async getRawDeck(gun: IGunChain<any>, location: { path:Path[],private:boolean }): Promise<RawDeck> {
    //console.log("START: getRawDeck");


    const deck: RawDeck = {
      cards: await this.getCards(this.gunService.getGunBase(location), location),
      decks: [],
      name: await this.getName(location),  // @ts-ignore
      uuid: path.at(-1).uuid,
    };

    // Call getDecks and wait for the result using await
    const aggregatedPaths = await this.getDecks(gun, location);

    // Use Promise.all to handle all the recursive calls to getRawDeck asynchronously
    const deckPromises = aggregatedPaths.map((p) => this.getRawDeck(this.gunService.getGunBase(p), p));
    deck.decks = await Promise.all(deckPromises);

    //console.log("END: getRawDeck", deck);
    return deck;
  }


  async getCards(gun: IGunChain<any>,location:Location): Promise<DeckCard[]> {
    return new Promise<DeckCard[]>((resolve) => {
      let aggregatedData: DeckCard[] = []
      gun.get("cards").once(async (data, key) => {
        if (data == null) {
          //console.log("no cards", path)
          resolve(aggregatedData)
        } else {
          let uuids = Object.keys(data)
          uuids = uuids.filter(e => e != "_")
          for (let uuid of uuids) {
            if (await this.isCardDeleted(location, uuid)) continue;
            aggregatedData.push({location: location, uuid: uuid})
          }
          resolve(aggregatedData)
        }
      })
    })
  }

  async getDecks(gun: IGunChain<any>, location: Location): Promise<Location[]> {
    //console.log("CALLED: getDecks")
    return new Promise<Location[]>((resolve) => {
      const aggregatedData: Location[] = [];

      gun.get("decks").once(async (data, key) => {
        if (data == null) {
          //console.log(path)
          resolve(aggregatedData)
        } else {
          //console.log("GET_DECKS_ONCE", Object.keys(data))
          let uuids = Object.keys(data)
          uuids = uuids.filter(e => e != "_")
          for (let uuid of uuids) {
            if (await this.isDeckDeleted([...path, {name: "", uuid: uuid}])) continue;
            aggregatedData.push([...path, {uuid: uuid, name: await this.getName([...path, {uuid: uuid, name: ""}])}])
          }
          resolve(aggregatedData)
        }
      })
    });
  }

  async getName(path: Path[]): Promise<string> {
    let gun = this.gunService.getGunBase(path)
    return new Promise<string>((resolve) => {
      gun.once((data, key) => {
        if (data) {
          //console.log("GET NAME:", data)
          resolve(data.name)
        } else {
          //console.log(path)
          resolve("not found")
        }
      })
    })
  }


  gun = this.gunService.get()

  makeBaseDeck(deck: CrowdAnkiDeckModel): CrowdAnkiBaseDeckModel {
    return {...this.exampleDeck, "children": [deck]}
  }

  async isDeckDeleted(path: Path[]): Promise<boolean> {
    let gun = this.gunService.getGunBase(path)
    return new Promise<boolean>((resolve) => {
        gun.once((data, key) => {
          resolve( !(data && !data.deleted));
        })
      }
    )

  }

  async isCardDeleted(path: Path[], uuid: string): Promise<boolean> {
    let gun = this.gunService.getGunBase(path).get("cards").get(uuid)
    return new Promise<boolean>((resolve) => {
        gun.once((data, key) => {
          resolve( !(data && !data.deleted));
        })
      }
    )
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

  dankiNodeModelUuid = "ae7d8d10-2d28-11ee-a20a-072d319e12c7"

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
    "name": "DAnki",
    "newLimit": null,
    "newLimitToday": null,
    "note_models": [
      {
        "__type__": "NoteModel",
        "crowdanki_uuid": "ae7d8d10-2d28-11ee-a20a-072d319e12c7",
        "css": "html,body,iframe{\n" +
          "height:100vh;\n" +
          "width:100vw;\n" +
          "border:none;\n" +
          "padding:0;\n" +
          "margin:0\n" +
          "}",
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
        "name": "DAnki",
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
            "afmt": "<iframe src='https://dweb.link/ipns/danki.menzel.lol/#/card/view/{{path}}/{{uuid}}?back=true'>",
            "bafmt": "",
            "bfont": "",
            "bqfmt": "",
            "bsize": 0,
            "did": null,
            "name": "Karte 1",
            "ord": 0,
            "qfmt": "<iframe src='https://dweb.link/ipns/danki.menzel.lol/#/card/view/{{path}}/{{uuid}}'>"
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
