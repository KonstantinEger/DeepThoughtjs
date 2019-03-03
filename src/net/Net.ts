import { Layer } from './Layer';
import { Matrix } from '../matrix/Matrix';
import { sigmoid } from './utils';

export class NeuralNet {
  private LEARNING_RATE = 0.01;
  private BIAS = 1;
  private INPUT_NODES: number;

  private hiddenLayers: Layer[];
  private outputLayer: Layer;

  constructor(...layers: number[]) {
    if (layers.length < 3) {
      throw new Error('Number of Layers must be at least 3');
    }
    this.INPUT_NODES = layers[0];
    this.hiddenLayers = [];
    for (let i = 1; i < layers.length - 1; i++) {
      this.hiddenLayers[i - 1] = new Layer(layers[i], layers[i - 1]);
    }
    this.outputLayer = new Layer(layers[layers.length - 1], layers[layers.length - 2]);
  }

  public feedforward(data: number[]) {
    if (data.length !== this.INPUT_NODES) {
      throw new Error('Input Array length must match Input-Layer shape');
    }

    let inputs = Matrix.from1DArray(data);
    inputs = inputs.map(sigmoid);

    for (let x = 0; x <= this.hiddenLayers.length; x++) {
      let values: Matrix;

      if (x === 0) {
        values = Matrix.multiply(this.hiddenLayers[x].weights, inputs);
      }
      else if (x > 0 && x < this.hiddenLayers.length) {
        values = Matrix.multiply(this.hiddenLayers[x].weights, this.hiddenLayers[x - 1].values);
      }
      else {
        values = Matrix.multiply(this.outputLayer.weights, this.hiddenLayers[x - 1].values);
      }
      values = values.map(v => v + this.BIAS);
      values = values.map(sigmoid);
      if (x < this.hiddenLayers.length) this.hiddenLayers[x].values = values;
      else this.outputLayer.values = values;
    }
    return Matrix.to1DArray(this.outputLayer.values);
  }
}