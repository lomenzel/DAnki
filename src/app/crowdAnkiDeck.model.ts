import {CrowdAnkiNoteModel} from "./crowdAnkiNote.model";

export interface CrowdAnkiDeckModel{

  __type__:"Deck";
  children: CrowdAnkiDeckModel[];
  crowdanki_uuid:string;
  deck_config_uuid:string;
  desc:"";
  dyn:0;
  extendedNew:0;
  extendedRev:0;
  media_files:[];
  newLimit:null;
  newLimitToday:null;
  notes:CrowdAnkiNoteModel[];
  reviewLimit:null;
  reviewLimitToday:null;
}
