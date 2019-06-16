import { Matrix } from "../matrix/Matrix";
import { randomInitializer } from "./utils";

export class Layer {
  public weights: Matrix;
  public values: Matrix;
  public nodes: number;

  constructor(nodes: number, nodesInFront: number) {
    this.values = new Matrix(nodes, 1, () => 1);
    this.weights = new Matrix(nodes, nodesInFront, randomInitializer);
    this.nodes = nodes;
  }
}