export const randomInitializer = () => Math.random() * (1 - (-1)) + (-1);

export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const dsigmoid = (y: number) =>  y * (1 - y);

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const randomFromArray = (array: any[]) => array[randomInt(0, array.length - 1)];