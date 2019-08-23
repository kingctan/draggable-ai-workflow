export type InstanceProps = {
  jobID: number
  jobName: string
  note: string
  createTime: number
  projectID: number
  projectName: string
  status: 'Pending' | 'Running' | 'Succeeded' | 'Skipped' | 'Failed' | 'Error'
  admin: {
    [k: string]: string
  }
}