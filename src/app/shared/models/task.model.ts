export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string; // user uuid
  createdAt: Date;
  completed: boolean;
}
