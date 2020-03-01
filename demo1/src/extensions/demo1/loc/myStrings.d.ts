declare interface IDemo1CommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'Demo1CommandSetStrings' {
  const strings: IDemo1CommandSetStrings;
  export = strings;
}
