import { OperatorModelProps } from "../operator/OperatorProps";

export type ProjectProps = {
  projectID: number // id
  projectName: string // 项目名
  note: string // 描述
  updateTime: number // 更新时间
  graph: GraphProps
};

export type GraphProps = {
  graph: OperatorModelProps[]
  version: string
};