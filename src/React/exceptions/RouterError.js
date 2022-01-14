export function RouterError(message) {
    const instance = new Error(message);
    Object.setPrototypeOf(
        instance, Object.getPrototypeOf(this)
    );
    instance.name = 'RouterError';
    if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, RouterError);
    }
    return instance;
}