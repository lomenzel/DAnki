import {Injectable} from '@angular/core';
import {GunService} from "./gun.service";
import {SettingsService} from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor(
    public gunService: GunService,
    public settingsService: SettingsService
  ) {
    this.gun.map().on((data, key) => this.event(data, key))
  }

  gun = this.gunService.get().get("danki-types")

  types: any[] = []

  event(data: any, key: string) {
    //console.log("data", data, "key", key, "types", this.types)
    //console.log("gun", this.gun)
    this.types = this.types.filter(e => e.key != key)
    if (data)
      fetch(this.settingsService.getIpfsGateway() + "/ipfs/" + data.cid + "/manifest.json")
        .then(a => {
          //console.log("try json parse", data.cid, a);
          return a.json()
        }).then(d => {
        //console.log("!!!!! Hier daten", d, data)
        if (this.types.filter(e => e.value.cid == data.cid).length == 0)
          this.types.push({"key": key, "value": {...d, "cid": data.cid}})
      }).catch(e => {
        if (this.types.filter(e => e.value.cid == data.cid).length == 0)
          this.types.push({"key": key, "value": {...data, "error": true}})
      })


  }

  get(withErrors: boolean, onChange: undefined | (() => void)): any[] {
    if (onChange !== undefined)
      this.gun.map().on(onChange)
    if (withErrors)
      return this.types
    else
      return this.types.filter(e => !e.value.error)
  }

  getFields(cid: string) {
    return this.types.filter(e => e.value.cid == cid)[0]?.value.fields
  }

  add(cid: string) {
    //console.log(this.gun)
    this.gun.set({"cid": cid})
  }

  remove(id: string) {
    this.gun.get(id).put(null)
  }

}
