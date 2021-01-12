import React, { useEffect, useReducer, useState } from "react";
import { createStore, combineReducers } from "redux";
import uuid from "uuid";

const reducer = combineReducers({
  activeThreadId: activeThreadIdReducer,
  threads: threadsReducer,
});

function threadsReducer(
  state = [
    {
      id: "1-fca2",
      title: "Buzz Aldrin",
      messages: [
        {
          text: "Twelve minutes to ignition",
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: "2-be91",
      title: "Michael Collins",
      messages: [],
    },
  ],
  action
) {
  if (action.type === "ADD_MESSAGE") {
    const threadIndex = findThreadIndex(state, action);
    const oldThread = state[threadIndex];
    const newThread = {
      ...oldThread,
      messages: messagesReducer(oldThread.messages, action),
    };
    return [
      ...state.slice(0, threadIndex),
      newThread,
      ...state.slice(threadIndex + 1, state.length),
    ];
  } else if (action.type === "DELETE_MESSAGE") {
    const threadIndex = findThreadIndex(state, action);
    const oldThread = state[threadIndex];
    const newThread = {
      ...oldThread,
      messages: messagesReducer(oldThread.messages, action),
    };
    return [
      ...state.slice(0, threadIndex),
      newThread,
      ...state.slice(threadIndex + 1, state.length),
    ];
  } else {
    return state;
  }
}

function findThreadIndex(threads, action) {
  switch (action.type) {
    case "ADD_MESSAGE": {
      return threads.findIndex((t) => t.id === action.threadId);
    }
    case "DELETE_MESSAGE": {
      return threads.findIndex((t) =>
        t.messages.find((m) => m.id === action.id)
      );
    }
  }
}

function messagesReducer(state = [], action) {
  switch (action.type) {
    case "ADD_MESSAGE": {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMessage);
    }
    case "DELETE_MESSAGE": {
      return state.filter((m) => m.id !== action.id);
    }
    default: {
      return state;
    }
  }
}

function activeThreadIdReducer(state = "1-fca2", action) {
  if (action.type === "OPEN_THREAD") {
    return action.id;
  } else {
    return state;
  }
}

const store = createStore(reducer);

function App() {
  const forceUpdate = useReducer((bool) => !bool)[1];
  useEffect(() => store.subscribe(() => forceUpdate()), []);
  const state = store.getState();
  const activeThreadId = state.activeThreadId;
  const threads = state.threads;
  const activeThread = threads.find((t) => t.id === activeThreadId);
  const tabs = threads.map((t) => ({
    title: t.title,
    active: t.id === activeThreadId,
    id: t.id,
  }));
  return (
    <div className="ui segment">
      <ThreadTabs tabs={tabs} />
      <Thread thread={activeThread} />
    </div>
  );
}

function MessageInput({ threadId }) {
  const [state, setState] = useState("");

  function onChange(e) {
    setState(e.target.value);
  }

  function handleSubmit() {
    store.dispatch({ type: "ADD_MESSAGE", text: state, threadId: threadId });
    setState("");
  }

  return (
    <div className="ui input">
      <input onChange={onChange} value={state} type="text" />
      <button
        onClick={handleSubmit}
        className="ui primary button"
        type="submit"
      >
        {" "}
        Submit
      </button>
    </div>
  );
}

function Thread({ thread }) {
  function handleClick(id) {
    store.dispatch({
      type: "DELETE_MESSAGE",
      id: id,
    });
  }

  return (
    <div className="ui center aligned basic segment">
      <div className="ui comments">
        {thread.messages.map((message, index) => (
          <div
            className="comment"
            key={index}
            onClick={() => handleClick(message.id)}
          >
            <div className="text">
              {message.text}{" "}
              <span className="metadata">@{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <MessageInput threadId={thread.id} />
    </div>
  );
}

function ThreadTabs({ tabs }) {
  function handleClick(id) {
    store.dispatch({
      type: "OPEN_THREAD",
      id: id,
    });
  }

  return (
    <div className="ui top attached tabular menu">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active ? "active item" : "item"}
          onClick={() => handleClick(tab.id)}
        >
          {tab.title}
        </div>
      ))}
    </div>
  );
}

export default App;
