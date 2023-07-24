import {Injectable} from '@angular/core';
import {GunService} from "./gun.service";

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor(
    public gunService: GunService
  ) {
    this.gun.map().on((data, key) => this.event(data, key))
  }

  gun = this.gunService.get().get("ankitube-types")

  types: any[] = [123]

  event(data: any, key: string) {
    //console.log("data", data, "key", key, "types", this.types)
    //console.log("gun", this.gun)


    fetch("http://localhost:8080/ipfs/" + data.cid + "/manifest.json")
      .then(a => {
        console.log("try json parse", data.cid, a);
        return a.json()
      }).then(d => {
      console.log("!!!!! Hier daten" + d, data)
      this.types = this.types.filter(e => e.key != key)
      this.types.push({"key": key, "value": {...d, "cid": data.cid}})
    }).catch(e => {
    })


  }

  get(): any[] {


    //console.log("get-types", this.types)
    return this.types
    //.map(e => {
    //return {"id": e.key, "cid": e.value}
    //})

  }

  add(cid: string) {
    //console.log(this.gun)
    this.gun.set({"cid": cid})
  }

  remove(id: string) {
    this.gun.get(id).put(null)
  }

}
