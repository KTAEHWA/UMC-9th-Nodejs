export class DuplicateUserEmailError extends Error {
  errorCode = "DUPLICATE_USER_EMAIL";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DataMappingError extends Error {
  errorCode = "USER_MAPPING_ERROR";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
