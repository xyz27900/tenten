const colors = [
  'black',
  'blue',
  'gray',
  'green',
  'lime',
  'orange',
  'purple',
  'red',
  'teal',
  'violet',
  'white',
  'yellow',
] as const;

export type Colors = Record<Uppercase<typeof colors[number]>, number>;
