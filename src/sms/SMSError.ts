export class NaverError extends Error {
  constructor(error, stack) {
    super(error);
    this.name = error;
    this.message = error;
    this.stack = JSON.stringify(stack);

    Object.setPrototypeOf(this, NaverError.prototype);
  }

  stack?: string | undefined;
}
