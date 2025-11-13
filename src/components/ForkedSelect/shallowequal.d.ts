declare module 'shallowequal' {
  function shallowequal(objA: any, objB: any, compare?: (a: any, b: any, indexOrKey?: number | string) => boolean | undefined, compareContext?: any): boolean;
  export = shallowequal;
}

