function reducer(state, action) {
  if (action.type === "INCREMENT") {
    return state + 1;
  } else {
    return state;
  }
}
