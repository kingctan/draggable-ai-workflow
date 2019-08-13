import { CSSProperties } from "react";
import { OperatorModelProps } from "../operator/OperatorProps";


export type FlowNodeProps = {
  id: string
  label: string
  icon: string
  style: CSSProperties
  type: 'both' | 'source' | 'target'
  deps?: string[]
  inputRuntime?: InputRuntimeProps
  outputRuntime?: OutputRuntimeProps
  model: OperatorModelProps
};

export type FlowNodesProps = {
  [nodeId: string]: FlowNodeProps
};

export type FlowConnectionProps = {
  id: string
  source: string
  target: string
};

export type InputRuntimeProps = {
  [key: string]: {
    id: string
    type: string
    name: string
  }
};

export type OutputRuntimeProps = {
  [key: string]: {
    type: string
  }
};

export type ParamConfigProps = {
  [nodeId: string]: {
    [key: string]: {
      value: string
      type: string
    }
  }
};