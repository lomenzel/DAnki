export interface CrowdAnkiDeckConfigModel {
  __type__: "DeckConfig";
  autoplay: boolean;
  buryInterdayLearning: boolean;
  crowdanki_uuid: string;
  dyn: boolean;
  interdayLearningMix: number;
  lapse: { delays: number[];
    leechAction:number;
    leechFails:number;
    minInt:number;
    mult:number;
  }

  maxTaken:number;
  name:string;
  new:{
    bury:boolean;
    delays: number[];
    initialFactor:number;
    ints:number[];
    order:number;
    perDay:number;
    separate:boolean;
  }
  newGatherPriority:number;
  newMix:number;
  newPerDayMinimum:number;
  newSortOrder:number;
  replayq:boolean;
  rev:{
    bury:boolean;
    ease4:number;
    fuzz:number;
    hardFactor:number;
    ivlFct:number;
    maxIvl:number;
    minSpace:number;
    perDay:number
  }
  reviewOrder:number;
  timer:number


}
