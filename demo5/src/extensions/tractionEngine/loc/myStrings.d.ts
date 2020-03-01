declare interface ITractionEngineCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'TractionEngineCommandSetStrings' {
  const strings: ITractionEngineCommandSetStrings;
  export = strings;
}
