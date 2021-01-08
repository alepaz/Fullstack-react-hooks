function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  const subscribe = (listener) => (
    listeners.push(listener)
  );

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.messages),
    };
  } else if (action.type === "DELETE_MESSAGE") {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(action.index + 1, state.messages.length),
      ],
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

const listener = () => {
  console.log('current state :');
  console.log(store.getState());
}

store.subscribe(listener);

const addMessageAction1 = {
  type: "ADD_MESSAGE",
  messages: "How do you read?",
};

store.dispatch(addMessageAction1);

const addMessageAction2 = {
  type: "ADD_MESSAGE",
  messages: "I read you loud and clear Houston.",
};

store.dispatch(addMessageAction2);

const deleteMessageAction = {
  type: 'DELETE_MESSAGE',
  index: 0,
}

store.dispatch(deleteMessageAction);
