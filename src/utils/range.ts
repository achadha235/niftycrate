function* range(a, b) {
  for (var i = a; i < b; ++i) yield i;
}

export default range;
