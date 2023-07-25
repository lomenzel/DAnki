import {Component} from '@angular/core';
import {SettingsService} from "../settings.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public settingsService: SettingsService) {
  }

  gunServers = this.settingsService.getGunServer()
  ipfsGateway = this.settingsService.getIpfsGateway()
  newGun = "";

  addGun() {
    this.settingsService.addGunServer(this.newGun)
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
}
