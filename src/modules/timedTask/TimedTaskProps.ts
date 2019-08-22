
export type TimedTaskProps = {
  ID: number
  projectID: number
  projectName: string
  currentJobID: string
  UpdatedAt: string
  cycle: number
  sync: boolean
  CreatedAt: string
  expectStartTime: string
  userID: string
  status: 'Running' | 'Stoped' | 'Failed'
};
