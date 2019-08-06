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
    train_data: string
    val_data: string
    lr: number
  },
  inputs: {
    data: {
      type: string
    }
  },
  outputs: {
    model: {
      type: string
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
};


// export type OperatorConfigInputOutput = string

export type OperatorConfigParam = {
  [type: string]: {
    name: string
    type: string
    default: string
  }
};