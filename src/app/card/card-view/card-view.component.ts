import {ChangeDetectorRef, Component} from '@angular/core';
import {GunService} from "../../gun.service";
import {TypesService} from "../../types.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent {

  data: any[] = [];
  path: any[] = [];
  gun = this.gunService.get()
  listeners: any[] = []
  card:any = {};

  constructor(
    public gunService: GunService,
    public typesService: TypesService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDirectorRef: ChangeDetectorRef) {
    this.route.paramMap.subscribe(params => {
      const jsonData = params.get('path');
      const cardID = params.get("card")
      try {
        if (jsonData) {
          this.data = JSON.parse(jsonData);
        } else {
          console.log("wtf", jsonData)
        }
        this.path = this.data
        //let uuid: string = this.data[this.data.length - 1].uuid
        let tmp = this.gun.get("decks").get(this.data[0].uuid)
        tmp.on((data, key, _msg, _ev) => {
          this.listeners.push(_ev)
          this.path[0] = {name: data.name, uuid: key, deleted: data.deleted}
        })

        if (this.data.length > 1) {
          for (let i = 1; i < this.data.length; i++) {
            tmp = tmp.get("decks").get(this.data[i].uuid)
            tmp.on((data, key, _msg, _ev) => {
              this.listeners.push(_ev)
              this.path[i] = {name: data.name, uuid: key, deleted: data.deleted}
            })
          }
        }

        if (cardID) {
          let card = tmp.get("cards").get(cardID)
          card.on((data,key)=>{console.log(data); this.card = data})
        }
      } catch (e) {
        console.error("something bad happend")
      }

    })

  }
}
