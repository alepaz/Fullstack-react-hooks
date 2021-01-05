function createStore(reducer, initialState) {
  let state = initialState;

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
  };

  return {
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.messages),
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

const addMessageAction1 = {
  type: "ADD_MESSAGE",
  messages: "How does it look, Neil?",
};

store.dispatch(addMessageAction1);

const stateV1 = store.getState();

const addMessageAction2 = {
  type: "ADD_MESSAGE",
  messages: "Looking good",
};

store.dispatch(addMessageAction2);
const stateV2 = store.getState();

console.log("State v1:");
console.log(stateV1);
console.log("State v2:");
console.log(stateV2);
