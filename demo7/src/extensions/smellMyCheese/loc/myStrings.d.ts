declare interface ISmellMyCheeseCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'SmellMyCheeseCommandSetStrings' {
  const strings: ISmellMyCheeseCommandSetStrings;
  export = strings;
}
