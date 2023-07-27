import {Injectable} from '@angular/core';
import {CrowdAnkiBaseDeckModel} from "./crowdAnkiBaseDeck.model";
import {CrowdAnkiDeckModel} from "./crowdAnkiDeck.model";
import {GunService} from "./gun.service";
import {IGunChain} from "gun";

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

  download(path: { name: string, uuid: string }[]): void {
    this.downloadFile(this.makeTextFile(JSON.stringify(this.getRawDeck(this.getGunBase(path),path))))
  }

/*
 async getBaseDeck(path: Path[]): Promise<CrowdAnkiBaseDeckModel> {
    return this.makeBaseDeck(this.makeCrowdankiDeck(await this.getRawDeck(this.getGunBase(path),path)))
  }

  makeCrowdankiDeck(deck: RawDeck): CrowdAnkiDeckModel {

  }
*/
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
    //TODO
    return {deck_configurations: [], extendNew: 0, extendRev: 0, name: "", node_models: [], ...deck}
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


}
