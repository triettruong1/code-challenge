export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
    Object.setPrototypeOf(this, InvalidInputError.prototype);
  }
}
