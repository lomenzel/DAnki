import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() {
  }

  getGunServer(): string[] {
    if (!localStorage.getItem("gunServers")) {
      return ["https://menzel.lol:8765/gun",'https://gun-manhattan.herokuapp.com/gun']
    } else { // @ts-ignore
      return JSON.parse(localStorage.getItem("gunServers"))
    }

  }

  addGunServer(server: string) {
    localStorage.setItem("gunServers", JSON.stringify(this.getGunServer().push(server)))

  }

  removeGunServer(server: string) {
    localStorage.setItem("gunServers", JSON.stringify(this.getGunServer().filter(e => e != server)))
  }

  getIpfsGateway(): string {
    if (!localStorage.getItem("ipfsGateway"))
      return "https://ipfs.io/ipfs/"
    else { // @ts-ignore
      return localStorage.getItem("ipfsGateway")
    }
  }

  setIpfsGateway(url:string) {
  localStorage.setItem("ipfsGateway",url)
  }

}
