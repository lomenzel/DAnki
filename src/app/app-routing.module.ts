import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";
import {DeckComponent} from "./deck/deck.component";
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: "", component: OverviewComponent},
  { path: "deck/:path", component: DeckComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule { }
