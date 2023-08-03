import {Injectable} from '@angular/core';
import GUN, {IGunChain, IGunInstance} from "gun";
import {SettingsService} from "./settings.service";

interface Path {
  name: string,
  uuid: string
}


@Injectable({
  providedIn: 'root'
})
export class GunService {

  constructor(public settingsService: SettingsService) {
  }

  gunRoot = "DAnki-Root-Node-beta"

  gun = GUN(this.settingsService.getGunServer())

  get() {
    return this.gun.get(this.gunRoot)
  }

  getGunBase(location: { path: Path[], private: boolean }): IGunChain<any> {
    //console.log("START: GetGunBase")
    let tmp: IGunChain<any> | IGunInstance<any> = this.gun
    if (!location.private) {
      tmp = this.gun.get(this.gunRoot)
      tmp = tmp.get("decks").get(location.path[0].uuid)
    } else {
      tmp = this.gun.get(location.path[0].uuid)
    }
    if (location.path.length > 1) {
      for (let i = 1; i < location.path.length; i++) {
        tmp = tmp.get("decks").get(location.path[i].uuid)
      }
    }
    //console.log("END: GetGunBase", tmp)
    return tmp
  }

}
