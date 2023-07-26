import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from "./overview/overview.component";
import {DeckComponent} from "./deck/deck.component";
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {SettingsComponent} from "./settings/settings.component";
import {CardViewComponent} from "./card/card-view/card-view.component";
import {CardPreviewComponent} from "./card/card-preview/card-preview.component";

const routes: Routes = [
  {path: "", component: OverviewComponent},
  {path: "deck/:path", component: DeckComponent},
  {path: "settings", component: SettingsComponent},
  {path: "card/view/:path/:card", component: CardViewComponent},
  {path: "card/preview/:path/:card",component:CardPreviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule {
}
