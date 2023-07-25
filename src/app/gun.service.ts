import { Injectable } from '@angular/core';
import GUN from "gun";
import {SettingsService} from "./settings.service";

@Injectable({
  providedIn: 'root'
})
export class GunService {

  constructor(public settingsService:SettingsService) { }

  gun = GUN(this.settingsService.getGunServer())

  get(){
    return this.gun
  }

}
