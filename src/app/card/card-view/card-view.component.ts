import {ChangeDetectorRef, Component} from '@angular/core';
import {GunService} from "../../gun.service";
import {TypesService} from "../../types.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SettingsService} from "../../settings.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

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
  card: any = {};
  frameURL: SafeResourceUrl = "";
  back = false

  constructor(
    public gunService: GunService,
    public typesService: TypesService,
    public settingsServie: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private changeDirectorRef: ChangeDetectorRef) {
    this.route.paramMap.subscribe(params => {
      const jsonData = params.get('path');
      const cardID = params.get("card")
      const back = params.get("back")

      try {
        if (jsonData) {
          this.data = JSON.parse(jsonData);
        } else {
          console.log("wtf", jsonData)
        }
        if (back)
          this.back = JSON.parse(back)
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
          card.on((data, key) => {
            console.log(data);
            this.card = data
            this.updateFrameURL()
          })
        }

        this.route.queryParamMap.subscribe(queryParams => {
          const back = queryParams.get("back");
          if (back) {
            this.back = JSON.parse(back);
            // Call updateFrameURL whenever the 'back' parameter changes
            this.updateFrameURL();
          }
        });

      } catch (e) {
        console.error(e)
      }

    })
  }

  updateFrameURL(): void {
    let url = this.settingsServie.getIpfsGateway() +"/ipfs/" + this.card.type + '?fields=' + this.card.fields + "&back=" + this.back
    this.frameURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
