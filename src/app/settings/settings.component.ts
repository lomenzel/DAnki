import {Component} from '@angular/core';
import {SettingsService} from "../settings.service";
import {PrivateService} from "../private.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public settingsService: SettingsService,public privateService:PrivateService) {
  }

  gunServers = this.settingsService.getGunServer()
  ipfsGateway = this.settingsService.getIpfsGateway()
  newGun = "";
  privateDecks = this.privateService.get()

  addGun() {
    this.settingsService.addGunServer(this.newGun)
    this.gunServers = this.settingsService.getGunServer()
  }

  removeGun(server:string){
    this.settingsService.removeGunServer(server);
    this.gunServers = this.settingsService.getGunServer()
  }

  newIpfs = ""

  setIpfs() {
    this.settingsService.setIpfsGateway(this.newIpfs)
    this.newIpfs = ""
    this.ipfsGateway = this.settingsService.getIpfsGateway()
  }
  reload(){
    location.reload()
  }

  removePrivate(id:string){
    this.privateService.remove(id)
    this.privateDecks = this.privateService.get()
  }
}
