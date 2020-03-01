declare interface ICakeCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'CakeCommandSetStrings' {
  const strings: ICakeCommandSetStrings;
  export = strings;
}
