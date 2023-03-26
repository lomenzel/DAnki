import { Component } from '@angular/core';

@Component({
  selector: 'app-notetypes',
  templateUrl: './notetypes.component.html',
  styleUrls: ['./notetypes.component.scss']
})
export class NotetypesComponent {

  types = [{
    name: "Basic"
  },{name:"Cloze"}]
}
