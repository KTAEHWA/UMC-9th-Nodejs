export class DuplicateUserEmailError extends Error {
  errorCode = "U001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DataMappingError extends Error {
  errorCode = "U100";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
