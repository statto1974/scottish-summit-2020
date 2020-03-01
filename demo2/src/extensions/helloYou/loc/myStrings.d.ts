declare interface IHelloYouCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'HelloYouCommandSetStrings' {
  const strings: IHelloYouCommandSetStrings;
  export = strings;
}
