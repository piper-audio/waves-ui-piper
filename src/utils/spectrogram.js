import FFT from './fft';

export default class Spectrogram {

  constructor(samples, options) {

    this.samples = samples;
    //!!! check existence and type of options
    this.stepSize = options.stepSize;
    this.fftSize = options.fftSize;

    const sz = this.fftSize;
    this.fft = new FFT(sz);
    this.ncols = Math.floor(this.samples.length / this.stepSize); //!!! not correct
    this.real = new Float32Array(sz);
    this.imag = new Float32Array(sz);
  }

  getColumnCount() {
    return this.ncols; 
  }

  getColumnHeight() {
    return Math.floor(this.fftSize / 2) + 1;
  }

  getColumn(n) {

    const startSample = n * this.stepSize;
    const sz = this.fftSize;

    this.real.fill(0);
    this.imag.fill(0);

    let available = sz;
    if (startSample + sz >= this.samples.length) {
      available = this.samples.length - startSample;
    }

    for (let i = 0; i < available; ++i) {
      this.real[i] = this.samples[startSample + i];
    }

    //!!! + window
    
    this.fft.forward(this.real, this.imag);

    const h = this.getColumnHeight();
    const col = new Float32Array(h);
    for (let i = 0; i < h; ++i) {
      const mag = Math.sqrt(this.real[i] * this.real[i] +
                            this.imag[i] * this.imag[i]);
      col[i] = mag;
    }
    return col;

  }
}
