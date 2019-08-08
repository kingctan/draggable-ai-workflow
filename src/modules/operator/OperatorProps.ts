export type OperatorProps = {
  title: string
  path: string
  children?: OperatorProps[]
  icon?: string
  model?: OperatorModelProps
};

export type OperatorModelProps = {
  componentID: number
  componentName: string
  directory: string
  params: {
    [k: string]: {
      name: string
      type: string
      default: string
      value?: string
    }
  },
  inputs: {
    [key: string]: {
      type: string
      note: string
    }
  },
  outputs: {
    [key: string]: {
      type: string
      note: string
    }
  },
  admin: {
    [id: string]: string
  },
  container: {
    image: string
    command: string
  },
  createTime: number
  note: string
  code: string
};


// export type OperatorConfigInputOutput = string

export type OperatorConfigParam = {
  [type: string]: {
    name: string
    type: string
    default: string
  }
};