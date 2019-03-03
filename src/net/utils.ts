export const randomInitializer = () => Math.random() * (1 - (-1)) + (-1);

export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const dsigmoid = (y: number) =>  y * (1 - y);