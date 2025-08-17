import { type Task } from '../types/Task';

// Calculate remaining effort (1 - percent_completed) * effort
export const getRemainingEffort = (task: Task): number => {
  return (1 - task.percent_completed / 100) * task.effort;
};

// Calculate urgency based on due date (closer = more urgent)
export const getUrgency = (task: Task): number => {
  if (!task.due_date) return 0;

  const now = new Date();
  const dueDate = new Date(task.due_date);
  const daysUntilDue = Math.max(0, Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Inverse relationship: fewer days = higher urgency
  // Max urgency (1) if due today or overdue, min urgency (0) if due in 30+ days
  return Math.max(0, Math.min(1, 1 - (daysUntilDue / 30)));
};

// Calculate circle size based on remaining effort and urgency
export const getCircleSize = (task: Task): number => {
  const remainingEffort = getRemainingEffort(task);
  const urgency = getUrgency(task);
  const priority = task.priority;

  // Base size between 10-50 based on remaining effort (1-10)
  const baseSize = 10 + (remainingEffort * 4);

  // Increase size based on urgency (up to 100% larger for most urgent tasks)
  // Also factor in priority (higher priority = larger)
  const urgencyFactor = urgency * 2.0; // Doubled twice from 0.5 to 2.0
  const priorityFactor = (priority - 1) / 3 * 0.5; // Adjust priority by urgency

  return (baseSize * (1 + priorityFactor)) * urgencyFactor;
};