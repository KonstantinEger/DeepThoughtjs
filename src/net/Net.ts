import { Layer } from './Layer';
import { Matrix } from '../matrix/Matrix';
import { sigmoid, randomFromArray, dsigmoid } from './utils';

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

  public train(trainingData: TrainingData[], iterations?: number) {
    if (!iterations) iterations = 60000;

    for (let x = 0; x < iterations; x++) {
      const data: TrainingData = randomFromArray(trainingData);
      let inputs = Matrix.from1DArray(data.data);
      inputs = inputs.map(v => v + this.BIAS);
      inputs = inputs.map(sigmoid);

      let output = Matrix.from1DArray(this.feedforward(data.data));
      let target = Matrix.from1DArray(data.expected);

      let error = target.subtract(output);

      let gradients = output.map(dsigmoid);
      gradients = gradients.map((v, r, c) => v * error.get(r, c));
      gradients = gradients.map(v => v * this.LEARNING_RATE);

      let hidden_t = this.hiddenLayers[this.hiddenLayers.length-1].values.transpose();
      let weights_h_o_delta = Matrix.multiply(gradients, hidden_t);
      this.outputLayer.weights = this.outputLayer.weights.map((v, r, c) => v + weights_h_o_delta.get(r,c));

      let weights_h_o_t = this.outputLayer.weights.transpose();
      error = Matrix.multiply(weights_h_o_t, error);

      for (let y = this.hiddenLayers.length - 1; y > 0; y--) {
        gradients = this.hiddenLayers[y].values.map(dsigmoid);
        gradients = gradients.map((v, r, c) => v * error.get(r, c));
        gradients = gradients.map(v => v * this.LEARNING_RATE);

        hidden_t = this.hiddenLayers[y-1].values.transpose();
        let weights_h_h_delta = Matrix.multiply(gradients, hidden_t);
        this.hiddenLayers[y].weights = this.hiddenLayers[y].weights.map((v, r, c) => v + weights_h_h_delta.get(r, c));

        let weights_h_h_t = this.hiddenLayers[y].weights.transpose();
        error = Matrix.multiply(weights_h_h_t, error);
      }

      gradients = this.hiddenLayers[0].values.map(dsigmoid);
      gradients = gradients.map((v, r, c) => v * error.get(r, c)) ;
      gradients = gradients.map(v => v * this.LEARNING_RATE);

      let inputs_t = inputs.transpose();
      let weights_i_h_delta = Matrix.multiply(gradients, inputs_t);
      this.hiddenLayers[0].weights = this.hiddenLayers[0].weights.map((v, r, c) => v + weights_i_h_delta.get(r, c));
    }
    console.log('done');
  }
}

interface TrainingData {
  data: number[];
  expected: number[];
}