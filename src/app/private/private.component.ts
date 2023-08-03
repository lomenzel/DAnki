import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PrivateService} from "../private.service";

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent {
  constructor(private router: Router,
              private route: ActivatedRoute,
              private privateService: PrivateService) {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id")
      if (id)
        this.privateService.add(id)
      this.router.navigate([""])
    })
  }

}
