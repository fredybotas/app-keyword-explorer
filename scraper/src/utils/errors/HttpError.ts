export class HttpError extends Error {
  constructor(readonly status: number, readonly message: string) {
    super(message);
  }
}
