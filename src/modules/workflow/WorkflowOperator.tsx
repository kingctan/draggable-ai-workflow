import React, { useState, BaseSyntheticEvent, useEffect } from 'react';
import { Tree, Input, Icon, message } from 'antd';
import axios from 'axios';
import { nodeData, NodeData } from './gData';
import { useDrag, DragSourceMonitor } from 'react-dnd';

type Props = {

};

const formatData = (nodeData: NodeData[], prevKey?: string) => {
  for (let i = 0; i < nodeData.length; i += 1) {
    const title = nodeData[i].title;
    nodeData[i].key = prevKey ? `${prevKey}/${title}` : title;
    if (nodeData[i].children) {
      formatData(nodeData[i].children as any, nodeData[i].key);
    }
  }
  return nodeData;
};
const gData = formatData(nodeData);

//@ts-ignore
const getParentKey = (key: string, tree: NodeData[]) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: NodeData) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

let dataList: NodeData[] = [];
const generateList = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const DraggableItem: React.SFC<any> = (props) => {
  const { data, title } = props;
  const name = data;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { name, type: 'box' },
    end: (dropResult?: { name: string, monitor: DragSourceMonitor }) => {
      if (dropResult) {
        // console.log('✨', dropResult);
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div ref={drag} className="draggable-tree-node">
      {title}
    </div>
  )
};

const WorkflowOperator: React.FC<Props> = (props) => {
  const { } = props;

  const [nodes, setNodes] = useState<NodeData[]>(gData);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');


  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const handleFilter = (e: BaseSyntheticEvent) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item: NodeData) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key!, nodes);
        }
        return null;
      })
      .filter((item: NodeData, i: number, self: NodeData[]) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const getOperators = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/tree`)
      .then((res) => {
        if (res.data.code === 200) {
          const newNodes = [...formatData(res.data.data), ...nodes];
          setNodes(newNodes);
          dataList = [];
          generateList(newNodes);
          console.log(dataList);
        }
      }).catch((err) => {
        message.error('服务器被吃了..');
      });
  };

  useEffect(() => {
    getOperators();
  }, []);

  const loop = (data: any) =>
    data.map((item: any) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.title}</span>
          );
      if (item.children) {
        return (
          <Tree.TreeNode key={item.key} title={title} icon={<Icon type="folder" />} selectable={false}>
            {loop(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          draggable
          isLeaf
          key={item.key}
          title={
            // title（不用item.title）是为了显示搜索有红色高亮的
            <DraggableItem data={item} title={title} />
          }
          icon={<Icon type="file-text" />}
          selectable={false}
        />
      );
    });

  return (
    <div className="workflow-operator">
      <Input.Search style={{ marginBottom: 8 }} placeholder="搜索组件" onChange={handleFilter} />
      <Tree.DirectoryTree
        showIcon
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        className="tree"
      >
        {loop(nodes)}
      </Tree.DirectoryTree>
    </div>
  );
};

export default WorkflowOperator;