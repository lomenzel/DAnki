import {CrowdAnkiDeckModel} from "./crowdAnkiDeck.model";
import {CrowdAnkiNoteModelModel} from "./crowdAnkiNoteModel.model";
import {CrowdAnkiNoteModel} from "./crowdAnkiNote.model";

export interface CrowdAnkiBaseDeckModel{
  __type__:"Deck";
  children:CrowdAnkiDeckModel[]
  crowdanki_uuid:string;
  deck_config_uuid:string;
  deck_configurations: CrowdAnkiDeckModel[];
  desc:string;
  dyn:number;
  extendNew:number;
  extendRev:number;
  media_files:[];
  name:string;
  newLimit:null;
  newLimitToday:null;
  node_models:CrowdAnkiNoteModelModel[]
  notes:CrowdAnkiNoteModel[];
  reviewLimit:null;
  reviewLimitToday:null;
}
