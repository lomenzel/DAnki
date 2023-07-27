import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent {
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.route.paramMap.subscribe(params => {
      this.strPath = params.get('path') ?? "";
      this.uuid = params.get("card") ?? "";
      this.updateURL()
    })
  }

  updateURL(){
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("./#/card/view/"+this.strPath+"/"+this.uuid+ "?back="+this.showAnswer);
  }

  answerChange(){
    setTimeout(()=>{this.updateURL()},10)
  }

  strPath = "";
  uuid = "";
  url: SafeResourceUrl = "";
  showAnswer=false
}
