import { Component } from '@angular/core';
import {TypesService} from "../types.service";

@Component({
  selector: 'app-notetypes',
  templateUrl: './notetypes.component.html',
  styleUrls: ['./notetypes.component.scss']
})
export class NotetypesComponent {

  constructor(public typesService:TypesService) {

  }
  neu:string= "";
  types = this.typesService.get(true,()=>{this.types = this.typesService.get(true,undefined)})

  add(){
    if(this.neu){
      this.typesService.add(this.neu)
      this.neu= ""
    }
  }
  remove(id:string){
    console.log("removing ", id)
    this.typesService.remove(id)
  }

}
