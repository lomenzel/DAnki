import {Component, Inject, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import GUN, {IGunChain, IGunInstance} from "gun";
import {GunService} from "../../gun.service";
import {TypesService} from "../../types.service";

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.scss']
})
export class CardEditComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {path:{ name: string, uuid: string }[],uuid:string},
    public dialogRef: MatDialogRef<CardEditComponent>,
    public gunService: GunService,
    public typesService:TypesService,
    private changeDirectorRef: ChangeDetectorRef) {
    this.path = [...this.data.path]
    let uuid: string = this.data.path[this.data.path.length - 1].uuid
    let tmp = this.gun.get("decks").get(this.data.path[0].uuid)

    if (this.data.path.length > 1) {
      for (let i = 1; i < this.data.path.length; i++) {
        tmp = tmp.get("decks").get(this.data.path[i].uuid)
      }
    }



    this.gDeck = tmp
    this.gCard = tmp.get("cards").get(this.data.uuid).on((data,key) =>{
      try{
        this.card = {...data,fields:JSON.parse(data.fields)}
      } catch(e){
        console.error(e)
      }
    })
  }
  gDeck;
  gun = this.gunService.get()
  path;
  gCard;
  card:any = {}
  update(){
    setTimeout(()=>{
      this.gCard.put({fields:JSON.stringify(this.card.fields)})
    },10)

  }
}
