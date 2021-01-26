export function propsCreator<T = {}>(...keys: Array<keyof T>) {
  const obj = {};
  return (x: T): T => {
    keys.forEach(y => Object.assign(obj, {[y]: x[y]}));
    return obj as T;
  };
}
