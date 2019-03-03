type Initializer = (row: number, col: number) => number;

export class Matrix {
  private rows: number;
  private cols: number;
  private data: Array<Array<number>>;

  constructor(rows: number, cols: number, init: Initializer) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < rows; i ++) {
      this.data[i] = [];
      for (let j = 0; j < cols; j++) {
        this.data[i][j] = init(i, j);
      }
    }
  }

  private forEach(cb: (val: number, row: number, col: number) => void) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        cb(this.data[i][j], i, j);
      }
    }
  }

  public subtract(matrix: Matrix) {
    return new Matrix(this.rows, this.cols, (r, c) => this.data[r][c] - matrix.data[r][c]);
  }

  public map(cb: (val: number, row: number, col: number) => number) {
    const res = new Matrix(this.rows, this.cols, (r, c) => this.data[r][c]);
    res.forEach((v, r, c) => {
      res.data[r][c] = cb(v, r, c);
    });
    return res;
  }

  public transpose() {
    return new Matrix(this.cols, this.rows, (r, c) => this.data[c][r]);
  }

  public log() {
    console.table(this.data);
  }

  public static multiply(a: Matrix, b: Matrix) {
    if (a.cols !== b.rows) {
      throw new Error('Columns of "a" must match rows of "b"');
    }
    const res = new Matrix(a.rows, b.cols, () => 1);
    res.forEach((v, r, c) => {
      let sum = 0;
      for (let k = 0; k < a.cols; k++) {
        sum += a.data[r][k] * b.data[k][c];
      }
      res.data[r][c] = sum;
    });
    return res;
  }

  public static from1DArray(array: number[]) {
    return new Matrix(array.length, 1, (r, c) => array[r]);
  }

  public static to1DArray(matrix: Matrix) {
    const res: number[] = [];
    matrix.forEach(v => res.push(v));
    return res;
  }
}