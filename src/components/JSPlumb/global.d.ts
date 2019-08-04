declare module '*.css';

declare module '*.json' {
  const value: any;
  // @ts-ignore
  export default value;
}

declare var System: {
  import: any;
};
