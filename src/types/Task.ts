export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  due_date: string;
  priority: number;
  status: string;
  effort: number;
  percent_completed: number;
  last_completed: string;
  completed_at?: string | null;
}
