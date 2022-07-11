const TIME_DELAY = 2000;

class CustomPromise {
  state = 'pending';
  cbQueue = [];
  errorHandle = () => {};
  finallyHandle = () => {};

  constructor(executor) {
    executor(this.#onResolve.bind(this), this.#onReject.bind(this));
  }
  then(cb) {
    this.cbQueue.push(cb);
    return this;
  }
  catch(cb) {
    this.errorHandle = cb;
    return this;
  }

  finally(cb) {
    this.finallyHandle = cb;
  }

  #onResolve(data) {
    this.cbQueue.forEach((cb) => {
      data = cb(data);
    });
    this.state = 'fulfilled';
    this.finallyHandle();
  }

  #onReject(error) {
    this.errorHandle(error);
    this.state = 'rejected';
    this.finallyHandle();
  }
}

function executor(resolve, reject) {
  setTimeout(() => {
    try {
      resolve('Promise resolved');
      // throw new Error('Promise rejected');
    } catch (error) {
      reject(error);
    }
  }, TIME_DELAY);
}

function makePromise() {
  return new CustomPromise(executor);
}

const myPromise = makePromise();
myPromise
  .then((response) => `${response} successfully`)
  .then((data) => data.toUpperCase())
  .then((data) => console.log(data))
  .catch((error) => console.log(error))
  .finally(() => console.log('finally happened'));
