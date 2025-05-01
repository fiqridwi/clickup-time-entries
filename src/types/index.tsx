export interface FormattedTimeEntry {
  start: number;
  duration: number;
  assignee: number;
  tid: string;
  response: string;
  status?: "success" | "error";
}
