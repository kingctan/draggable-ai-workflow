export type InstanceProps = {
  jobID: number
  jobName: string
  note: string
  createTime: number
  projectID: number
  projectName: string
  status: string
  admin: {
    [k: string]: string
  }
}