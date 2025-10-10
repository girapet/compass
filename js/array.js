
// creates a new array of size n filled with value v; the value can also be a function 
// that returns a value

const array = (n, v) => {
  const a = new Array(n);

  if (v !== undefined) {
    const isFunction = v instanceof Function;

    for (let i = 0; i < n; i++) {
      a[i] = isFunction ? v() : v;
    }
  }

  return a;
};

export default array;