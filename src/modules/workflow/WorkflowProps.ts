import { CSSProperties } from "react";

export type FlowNodeProps = {
  [key: string]: {
    id?: string
    label: string,
    icon: string
    style: CSSProperties
    type: 'both' | 'source' | 'target'
  }
};