import { type Task } from "../../types/Task";
import TaskListItem from "./TaskListItem";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  selectedTaskId: string | null;
  onTaskUpdated: () => void;
  onDeleteTask: (task: Task) => void;
}

const TaskList = ({ tasks, onTaskSelect, selectedTaskId, onTaskUpdated, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No tasks available
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onTaskSelect={onTaskSelect}
            isSelected={selectedTaskId === task.id}
            onTaskUpdated={onTaskUpdated}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
