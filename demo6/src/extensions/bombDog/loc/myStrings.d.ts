declare interface IBombDogCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'BombDogCommandSetStrings' {
  const strings: IBombDogCommandSetStrings;
  export = strings;
}
