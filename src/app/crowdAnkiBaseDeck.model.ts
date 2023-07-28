import {CrowdAnkiDeckModel} from "./crowdAnkiDeck.model";
import {CrowdAnkiNoteModelModel} from "./crowdAnkiNoteModel.model";
import {CrowdAnkiNoteModel} from "./crowdAnkiNote.model";
import {CrowdAnkiDeckConfigModel} from "./crowdAnkiDeckConfig.model";

export interface CrowdAnkiBaseDeckModel{
  __type__:"Deck";
  children:CrowdAnkiDeckModel[]
  crowdanki_uuid:string;
  deck_config_uuid:string;
  deck_configurations: CrowdAnkiDeckConfigModel[];
  desc:string;
  dyn:number;
  extendNew:number;
  extendRev:number;
  media_files:[];
  name:string;
  newLimit:null;
  newLimitToday:null;
  note_models:CrowdAnkiNoteModelModel[]
  notes:CrowdAnkiNoteModel[];
  reviewLimit:null;
  reviewLimitToday:null;
}
