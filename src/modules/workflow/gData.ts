export type NodeData = {
  title: string
  key?: string
  children?: NodeData[]
};

export const nodeData: NodeData[] = [
  {
    title: '常用组件',
    children: [{
      title: '过滤与映射',
    }, {
      title: '加权与采样',
    }]
  },
  {
    title: '数据预处理',
    children: [{
      title: '采样和过滤',
      children: [{
        title: '随机采样',
      }, {
        title: '加权采样',
      }, {
        title: '过滤与映射',
      }, {
        title: '分层采样',
      }]
    }, {
      title: '合并',
      children: [{
        title: 'JOIN',
      }, {
        title: '合并列',
      }, {
        title: '合并行（UNION）',
      }]
    }, {
      title: '类型转换',
    }, {
      title: '增加序号列',
    }, {
      title: '拆分',
    }, {
      title: '缺失值补充',
    }, {
      title: '归一化',
    }, {
      title: '标准化',
    }, {
      title: 'KV to Table',
    }, {
      title: 'Table to KV',
    },]
  },
  {
    title: '统计分析',
    children: [{
      title: '数据视图',
    }, {
      title: '协方差',
    }, {
      title: '经验概率密度图',
    }, {
      title: '全表统计',
    }, {
      title: '卡方拟合性检验',
    }, {
      title: '正态检验',
    },]
  },
  {
    title: '机器学习',
    children: [{
      title: '二分类',
      children: [{
        title: 'GBDT二分类',
      }, {
        title: 'PS-SMART 二分类训练',
      }, {
        title: '线性支持向量机',
      }, {
        title: '逻辑回归二分类',
      }]
    }, {
      title: '多分类',
      children: [{
        title: 'PS-SMART 多分类',
      }, {
        title: 'AdaBoost 多分类',
      }, {
        title: 'K近邻',
      }, {
        title: '逻辑回归多分类',
      }, {
        title: '随机森林',
      }, {
        title: '朴素贝叶斯',
      }]
    }, {
      title: '聚类',
      children: [{
        title: 'K均值聚类',
      }, {
        title: 'DBSCAN',
      }]
    }]
  }
];