function TaskCard({ task }) {
  return (
    <section className="task">
      <p className="instruction">{task.instruction}</p>
      <h2>{task.question}</h2>
    </section>
  );
}

export default TaskCard;