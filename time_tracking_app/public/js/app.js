const TimersDashboard = props => {
  const [timers, setTimers] = React.useState([
    {
      title: "Practice squat",
      project: "Gym Chores",
      id: uuid.v4(),
      elapsed: 5456099,
      runningSince: Date.now()
    },
    {
      title: "Bake squash",
      project: "Kitchen Chores",
      id: uuid.v4(),
      elapsed: 1273998,
      runningSince: null
    }
  ]);

  const handleCreateFormSubmit = timer => {
    createTimer(timer);
  };

  const handleTrashClick = timerId => {
    deleteTimer(timerId);
  };

  const handleStartClick = timerId => {
    startTimer(timerId);
  };

  const handleStopClick = timerId => {
    stopTimer(timerId);
  };

  const handleEditFormSubmit = attrs => {
    updateTimer(attrs);
  };

  const createTimer = timer => {
    const t = helpers.newTimer(timer);
    setTimers(timers.concat(t));
  };

  const updateTimer = attrs => {
    setTimers(
      timers.map(timer => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
        } else {
          return timer;
        }
      })
    );
  };

  const deleteTimer = timerId => {
    setTimers(timers.filter(timer => timer.id !== timerId));
  };

  const startTimer = timerId => {
    const now = Date.now();
    setTimers(
      timers.map(timer => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now
          });
        } else {
          return timer;
        }
      })
    );
  };

  const stopTimer = timerId => {
    const now = Date.now();
    setTimers(
      timers.map(timer => {
        if (timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null
          });
        } else {
          return timer;
        }
      })
    );
  };

  return (
    <div className="ui three column centered grid">
      <div className="column">
        <EditableTimerList
          timers={timers}
          onFormSubmit={handleEditFormSubmit}
          onTrashClick={handleTrashClick}
          onStartClick={handleStartClick}
          onStopClick={handleStopClick}
        />
        <ToggleableTimerForm
          isOpen={true}
          onFormSubmit={handleCreateFormSubmit}
        />
      </div>
    </div>
  );
};

const EditableTimerList = props => {
  const timers = props.timers.map(timer => (
    <EditableTimer
      key={timer.id}
      id={timer.id}
      title={timer.title}
      project={timer.project}
      elapsed={timer.elapsed}
      runningSince={timer.runningSince}
      onFormSubmit={props.onFormSubmit}
      onTrashClick={props.onTrashClick}
      onStartClick={props.onStartClick}
      onStopClick={props.onStopClick}
    />
  ));
  return <div id="timers">{timers}</div>;
};

const EditableTimer = props => {
  const [editFormOpen, setEditFormOpen] = React.useState(false);

  const handleEditClick = () => {
    openForm();
  };

  const handleFormClose = () => {
    closeForm();
  };

  const handleSubmit = timer => {
    props.onFormSubmit(timer);
    closeForm();
  };

  const closeForm = () => {
    setEditFormOpen(false);
  };

  const openForm = () => {
    setEditFormOpen(true);
  };

  if (editFormOpen) {
    return (
      <TimerForm
        id={props.id}
        title={props.title}
        project={props.project}
        onFormSubmit={handleSubmit}
        onFormClose={handleFormClose}
      />
    );
  } else {
    return (
      <Timer
        id={props.id}
        title={props.title}
        project={props.project}
        elapsed={props.elapsed}
        runningSince={props.runningSince}
        onEditClick={handleEditClick}
        onTrashClick={props.onTrashClick}
        onStartClick={props.onStartClick}
        onStopClick={props.onStopClick}
      />
    );
  }
};

const TimerForm = props => {
  const [title, setTitle] = React.useState(props.title || "");
  const [project, setProject] = React.useState(props.project || "");

  const handleTitleChange = e => {
    setTitle(e.target.value);
  };

  const handleProjectChange = e => {
    setProject(e.target.value);
  };

  const handleSubmit = () => {
    props.onFormSubmit({
      id: props.id,
      title: title,
      project: project
    });
  };

  const submitText = props.id ? "Update" : "Create";
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="ui form">
          <div className="field">
            <label>Title</label>
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div className="field">
            <label>project</label>
            <input type="text" value={project} onChange={handleProjectChange} />
          </div>
          <div className="ui two bottom attached buttons">
            <button className="ui basic blue button" onClick={handleSubmit}>
              {submitText}
            </button>
            <button className="ui basic red button" onClick={props.onFormClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleableTimerForm = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFormOpen = () => {
    setIsOpen(true);
  };

  const handleFormClose = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = timer => {
    props.onFormSubmit(timer);
    setIsOpen(false);
  };

  if (isOpen) {
    return (
      <TimerForm
        onFormClose={handleFormClose}
        onFormSubmit={handleFormSubmit}
      />
    );
  } else {
    return (
      <div className="ui basic content center aligned segment">
        <button className="ui basic button icon" onClick={handleFormOpen}>
          <i className="plus icon" />
        </button>
      </div>
    );
  }
};

const Timer = props => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  React.useEffect(() => {
    const forceUpdateInterval = setInterval(() => forceUpdate(), 100);
    return () => {
      clearInterval(forceUpdateInterval);
    };
  }, []);

  const handleStartClick = () => {
    props.onStartClick(props.id);
  };

  const handleStopClick = () => {
    props.onStopClick(props.id);
  };

  const handleTrashClick = () => {
    props.onTrashClick(props.id);
  };

  const elapsedString = helpers.renderElapsedString(
    props.elapsed,
    props.runningSince
  );
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="header">{props.title}</div>
        <div className="meta">{props.project}</div>
        <div className="center aligned description">
          <h2>{elapsedString}</h2>
        </div>
        <div className="extra content">
          <span className="right floated edit icon" onClick={props.onEditClick}>
            <i className="edit icon" />
          </span>
          <span className="right floated trash icon" onClick={handleTrashClick}>
            <i className="trash icon" />
          </span>
        </div>
      </div>
      <TimerActionButton
        timerIsRunning={!!props.runningSince}
        onStartClick={handleStartClick}
        onStopClick={handleStopClick}
      />
    </div>
  );
};

const TimerActionButton = props => {
  if (props.timerIsRunning) {
    return (
      <div
        className="ui bottom attached red basic button"
        onClick={props.onStopClick}
      >
        Stop
      </div>
    );
  } else {
    return (
      <div
        className="ui bottom attached green basic button"
        onClick={props.onStartClick}
      >
        Start
      </div>
    );
  }
};

ReactDOM.render(<TimersDashboard />, document.getElementById("content"));
