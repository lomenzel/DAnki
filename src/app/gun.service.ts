import { Injectable } from '@angular/core';
import GUN from "gun";

@Injectable({
  providedIn: 'root'
})
export class GunService {

  constructor() { }

  gun = GUN(['https://gun-manhattan.herokuapp.com/gun', 'https://menzel.lol:8765/gun'])

  get(){
    return this.gun
  }

}
