class ApplicationError extends Error {

  constructor(error, status) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = error.name || this.constructor.name;
    this.message = error.message || 'Something went wrong. Please try again';
    this.stack = error.stack;
    this.code = status || 500;
  }
}

module.exports = ApplicationError;
