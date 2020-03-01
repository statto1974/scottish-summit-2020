declare interface IEnviromationCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'EnviromationCommandSetStrings' {
  const strings: IEnviromationCommandSetStrings;
  export = strings;
}
