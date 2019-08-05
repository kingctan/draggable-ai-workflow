import React, { useState, BaseSyntheticEvent } from 'react';
import { Tree, Input, Icon } from 'antd';
import { nodeData, NodeData } from './gData';
import { useDrag, DragSourceMonitor } from 'react-dnd';

type Props = {

};


const formatData = (nodeData: NodeData[], prevKey?: string) => {
  for (let i = 0; i < nodeData.length; i += 1) {
    const title = nodeData[i].title;
    nodeData[i].key = prevKey ? `${prevKey}-${title}` : title;
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

const dataList: NodeData[] = [];
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
  const { data } = props;
  const name = data;
  const [{ isDragging }, drag, preview] = useDrag({
    item: { name, type: 'box' },
    end: (dropResult?: { name: string, monitor: DragSourceMonitor }) => {
      if (dropResult) {
        // console.log('✨', dropResult);
        // console.log(`You dropped ${name} into ${dropResult.name}!`)
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  // const opacity = isDragging ? 0.6 : 1;
  return (
    <div
      ref={drag}
      className="draggable-tree-node"
      style={{
        opacity: 1,
      }}
    >
      {data.title}
    </div>
  )
};

const WorkflowBrick: React.FC<Props> = (props) => {
  const { } = props;

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
          return getParentKey(item.key!, gData);
        }
        return null;
      })
      .filter((item: NodeData, i: number, self: NodeData[]) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };



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
          title={<DraggableItem data={item} />}
          icon={<Icon type="file-text" />}
          selectable={false}
        />
      );
    });

  return (
    <div className="workflow-brick">
      <Input.Search style={{ marginBottom: 8 }} placeholder="搜索组件" onChange={handleFilter} />
      <Tree.DirectoryTree
        showIcon
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        className="tree"
      >
        {loop(gData)}
      </Tree.DirectoryTree>
    </div>
  );
};

export default WorkflowBrick;