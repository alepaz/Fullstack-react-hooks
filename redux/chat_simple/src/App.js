import React, { useEffect, useState } from "react";

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener) => listeners.push(listener);

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === "ADD_MESSAGE") {
    return {
      messages: state.messages.concat(action.message),
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

function App() {
  const forceUpdate = React.useReducer(bool => !bool)[1];
  const messages = store.getState().messages;
  useEffect(() => store.subscribe(() => forceUpdate()), []);
  return (
    <div className="ui segment">
      <MessageView messages={messages} />
      <MessageInput />
    </div>
  );
}

function MessageInput() {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    store.dispatch({ type: "ADD_MESSAGE", message: value });
    setValue("");
  };

  return (
    <div className="ui input">
      <input onChange={onChange} value={value} type="text" />
      <button
        onClick={handleSubmit}
        className="ui primary button"
        type="submit"
      />
    </div>
  );
}

function MessageView({ messages }) {
  const handleClick = (index) => {
    store.dispatch({ type: "DELETE_MESSAGE", index: index });
  };

  return messages.map((message, index) => (
    <div className="comment" key={index} onClick={() => handleClick(index)}>
      {message}
    </div>
  ));
}

export default App;
