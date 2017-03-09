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

  getColumn(n) {
    const sliceMethod = this.samples instanceof Float32Array ? 'subarray' : 'slice';
    const startSample = n * this.stepSize;
    const sz = this.fftSize;
    const slice = this.samples[sliceMethod](startSample, startSample + sz);
    if (slice.length < sz) return [];
    
    this.real.set(slice);
    this.imag.fill(0);
    this.fft.forward(this.real, this.imag);
    
    const col = new Float32Array(sz);
    for (let i = 0; i < sz; ++i) {
      col[i] = Math.sqrt(this.real[i] * this.real[i] + this.imag[i] * this.imag[i]);
    }
    return col;
  }
}
