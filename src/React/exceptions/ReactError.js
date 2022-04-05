export function ReactError(message) {
  const instance = new Error(message);
  Object.setPrototypeOf(
      instance, Object.getPrototypeOf(this)
  );
  instance.name = 'ReactError';
  if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, RouterError);
  }
  return instance;
}