import React, { useState, SyntheticEvent, useEffect } from 'react';
import { Form, Radio, Input, Select, Tabs, Icon, Button, Divider, message, InputNumber, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { v4 } from 'uuid';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
// import 'brace/snippets/python';
import { formItemLayout, tailFormItemLayout } from '../../utils/FormLayout';
import { Link } from 'react-router-dom';
import { OperatorConfigParam } from './OperatorProps';
import './operator.styl';

type Props = {

};


interface OperatorDetailProps extends FormComponentProps {

};

const MyFormItemTitle: React.SFC<{ name: string, handleClick: () => void }> = ({ name, handleClick }) => (
  <Form.Item {...tailFormItemLayout}>
    <h3 style={styles.H3}>
      {name}
      <Icon
        type="close-square"
        className="config-delete-btn"
        onClick={handleClick}
      />
    </h3>
  </Form.Item>
);

const MyDivider: React.SFC<{ visible: boolean }> = ({ visible }) => (
  visible ?
    <Form.Item {...tailFormItemLayout}>
      <Divider />
    </Form.Item> : null
);

const COMPONENT_TYPES = ['数据', '数据处理', '算法', '评估', '模型', '报表'];
const INPUT_OUTPUT_TYPES = ['Dataset', 'RawData', 'Model', 'Log'];
const PARAM_TYPES = [{
  value: 'boolean',
  title: '布尔'
}, {
  value: 'int',
  title: '整数',
}, {
  value: 'float',
  title: '浮点数',
}, {
  value: 'string',
  title: '字符串',
}];

const generateUniqueName = (name: string) => `${name}-${v4().slice(-4)}`;


const OperatorDetail: React.FC<Props & OperatorDetailProps> = (props) => {
  const { } = props;
  const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, setFieldsValue } = props.form;
  const { componentId } = (props as any).match.params;

  const [tab, setTab] = useState('basic');
  const [confInput, setConfInput] = useState<string[]>([generateUniqueName('input')]);
  const [confOutput, setConfOutput] = useState<string[]>([generateUniqueName('output')]);
  const [confParam, setConfParam] = useState<string[]>([generateUniqueName('param')]);

  const handleChangeTab = (activeKey: string) => setTab(activeKey);

  const handleAddInput = () => setConfInput([...confInput, generateUniqueName('input')]);

  const handleAddOutput = () => setConfOutput([...confOutput, generateUniqueName('output')]);

  const handleAddParam = () => setConfParam([...confParam, generateUniqueName('param')]);

  const handleRemoveInput = (index: number) => {
    if (confInput.length + confOutput.length <= 1) return message.warning('请保证至少存在一个输入或输出');
    setConfInput([...confInput.slice(0, index), ...confInput.slice(index + 1)]);
  };

  const handleRemoveOutput = (index: number) => {
    if (confOutput.length + confInput.length <= 1) return message.warning('请保证至少存在一个输入或输出');
    setConfOutput([...confOutput.slice(0, index), ...confOutput.slice(index + 1)]);
  };

  const handleRemoveParam = (index: number) => {
    setConfParam([...confParam.slice(0, index), ...confParam.slice(index + 1)]);
  };

  const getOperatorInfo = () => {
    axios.get(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/get?componentID=${componentId}`)
      .then((res) => {
        if (res.data.code === 200) {
          const values = res.data.data;
          // console.log(values);
          setConfInput(Object.keys(values.inputs));
          setConfOutput(Object.keys(values.outputs));
          setConfParam(Object.keys(values.params));
          const inputs: any = [];
          const outputs: any = [];
          const params: any = [];
          Object.keys(values.inputs).forEach((name: string) => {
            inputs.push({
              name,
              type: values.inputs[name].type,
              note: values.inputs[name].note,
            });
          });
          values.inputs = inputs;
          Object.keys(values.outputs).forEach((name: string) => {
            outputs.push({
              name,
              type: values.outputs[name].type,
              note: values.outputs[name].note,
            });
          });
          values.outputs = outputs;
          Object.keys(values.params).forEach((key: string) => {
            params.push({
              key,
              name: values.params[key].name,
              type: values.params[key].type,
              default: values.params[key].default,
            });
          });
          values.params = params;
          setFieldsValue({
            ...values,
            directory: values.directory ? values.directory.slice(values.directory.lastIndexOf('/') + 1) : '',
            code: PRESET_CODE,
          });
          values.code && axios.get(values.code).then((res) => {
            setFieldsValue({
              code: res.data,
            });
          });
        }
      }).catch((err) => {
        message.error('服务器被吃了..');
      });
  };

  const handelSubmit = () => {
    validateFields((error: any) => {
      if (error) return message.warning('请检查填写漏填或错误的内容');
      const formValues = getFieldsValue();
      const inputs: any = {};
      const outputs: any = {};
      const params: any = {};
      console.log(formValues);
      formValues.inputs && formValues.inputs.forEach((item: { name: string, type: string, note: string }) => {
        inputs[item.name] = {
          type: item.type,
          note: item.note,
        }
      });
      formValues.outputs && formValues.outputs.forEach((item: { name: string, type: string, note: string }) => {
        outputs[item.name] = {
          type: item.type,
          note: item.note,
        }
      });
      formValues.params && formValues.params.forEach((item: { key: string, name: string, type: string, default: string }) => {
        params[item.key] = {
          name: item.name,
          type: item.type,
          default: item.default,
        }
      });
      const finalObj: any = {
        ...formValues,
        directory: `/自定义/${formValues.directory}`,
        admin: { root: 'root' },
        inputs,
        outputs,
        params,
      };

      if (componentId) { // 更新算子
        finalObj.componentID = Number(componentId);
        axios.put(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/update`, finalObj)
          .then((res) => {
            if (res.data.code === 200) {
              message.success('已更新');
              (props as any).history.push(`/operator-list/${encodeURIComponent(`自定义/${formValues.directory}`)}`);
            }
          }).catch((err) => {
            message.error('服务器被吃了..');
          });
      } else { // 新增算子
        axios.post(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/create`, finalObj)
          .then((res) => {
            if (res.data.code === 200) {
              message.success('新增成功');
              (props as any).history.push(`/operator-list/${encodeURIComponent(`自定义/${formValues.directory}`)}`);
            }
          }).catch((err) => {
            message.error('服务器被吃了..');
          });
      }
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '注意',
      content: `确定删除算子：${getFieldValue('componentName')}？`,
      onOk: () => {
        axios.delete(`${process.env.REACT_APP_GO_WORKFLOW_SERVER}/component/delete?componentID=${componentId}`)
          .then((res) => {
            if (res.data.code === 200) {
              message.success('删除成功');
              (props as any).history.push(`/operator-list/${encodeURIComponent(sessionStorage.getItem('OperatorListCurrentPath') || '')}`);
            }
          }).catch((err) => {
            message.error('服务器被吃了..');
          });
      }
    });
  };

  useEffect(() => {
    if (componentId) {
      getOperatorInfo();
    }
  }, []);

  return (
    <div>
      <div className="main-toolbar">
        <Link to={`/operator-list/${encodeURIComponent(sessionStorage.getItem('OperatorListCurrentPath') || '')}`}>
          <Button><Icon type="caret-left" /> 返回列表</Button>
        </Link>
        <Divider type="vertical" />
        <Button type="primary" onClick={handelSubmit} style={{ marginLeft: 10 }}>
          <Icon type="check" /> 确认保存
        </Button>
        {
          componentId &&
          <Button type="danger" onClick={handleDelete}>
            <Icon type="delete" /> 删除
          </Button>
        }
        {
          tab === 'input' &&
          <Button onClick={handleAddInput}><Icon type="plus-square" /> 新增输入</Button>
        }
        {
          tab === 'output' &&
          <Button onClick={handleAddOutput}><Icon type="plus-square" /> 新增输出</Button>
        }
        {
          tab === 'param' &&
          <Button onClick={handleAddParam}><Icon type="plus-square" /> 新增参数</Button>
        }
      </div>
      <Form onSubmit={() => { }}>
        <Tabs activeKey={tab} onChange={handleChangeTab}>
          <Tabs.TabPane tab="基础属性" key="basic" style={styles.tabPaneStyle}>
            {
              componentId &&
              <Form.Item label="算子ID" required {...formItemLayout}>
                {getFieldDecorator('componentID')(<Input disabled />)}
              </Form.Item>
            }
            <Form.Item label="算子名称" required {...formItemLayout}>
              {getFieldDecorator('componentName', {
                rules: [{
                  required: true,
                  message: '请填写算子名称',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="算子类型" required {...formItemLayout}>
              {getFieldDecorator('directory', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请选择算子类型',
                }],
              })(
                <Select>
                  {COMPONENT_TYPES.map((item: any) => (
                    <Select.Option value={item} key={item}>{item}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="描述" {...formItemLayout}>
              {getFieldDecorator('note', {
              })(<Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />)}
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="输入配置" key="input" style={styles.tabPaneStyle}>
            {
              confInput.map((inputName: string, index: number) => (
                <div key={index}>
                  <MyFormItemTitle
                    name={inputName}
                    handleClick={() => handleRemoveInput(index)}
                  />
                  <Form.Item label="输入名称" required {...formItemLayout}>
                    {getFieldDecorator(`inputs[${index}].name`, {
                      initialValue: inputName,
                      rules: [
                        { required: true, message: '请填写输入名称' },
                      ],
                    })(
                      <Input onChange={(e) => { confInput[index] = e.target.value; setConfInput(confInput); }} />
                    )}
                  </Form.Item>
                  <Form.Item label="输入类型" required {...formItemLayout}>
                    {getFieldDecorator(`inputs[${index}].type`, {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请选择输入类型' },
                      ],
                    })(
                      <Select>
                        {INPUT_OUTPUT_TYPES.map((item: any) => (
                          <Select.Option value={item} key={item}>{item}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="输入描述" {...formItemLayout}>
                    {getFieldDecorator(`inputs[${index}].note`, {
                      initialValue: '',
                    })(
                      <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />
                    )}
                  </Form.Item>
                  <MyDivider visible={index !== confInput.length - 1} />
                </div>
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="输出配置" key="output" style={styles.tabPaneStyle}>
            {
              confOutput.map((outputName: string, index: number) => (
                <div key={index}>
                  <MyFormItemTitle
                    name={outputName}
                    handleClick={() => handleRemoveOutput(index)}
                  />
                  <Form.Item label="输出名称" required {...formItemLayout}>
                    {getFieldDecorator(`outputs[${index}].name`, {
                      initialValue: outputName,
                      rules: [
                        { required: true, message: '请填写输出名称' },
                      ],
                    })(
                      <Input onChange={(e) => { confOutput[index] = e.target.value; setConfOutput(confOutput); }} />
                    )}
                  </Form.Item>
                  <Form.Item label="输出类型" required {...formItemLayout}>
                    {getFieldDecorator(`outputs[${index}].type`, {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请选择输出类型' },
                      ],
                    })(
                      <Select>
                        {INPUT_OUTPUT_TYPES.map((item: any) => (
                          <Select.Option value={item} key={item}>{item}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="输出描述" {...formItemLayout}>
                    {getFieldDecorator(`outputs[${index}].note`, {
                      initialValue: '',
                    })(
                      <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />
                    )}
                  </Form.Item>
                  <MyDivider visible={index !== confOutput.length - 1} />
                </div>
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="可调参数" key="param" style={styles.tabPaneStyle}>
            {
              confParam.map((paramName: string, index: number) => (
                <div key={index}>
                  <MyFormItemTitle
                    name={paramName}
                    handleClick={() => handleRemoveParam(index)}
                  />
                  <Form.Item label="参数名称" required {...formItemLayout}>
                    {getFieldDecorator(`params[${index}].key`, {
                      initialValue: paramName,
                      rules: [
                        { required: true, message: '请填写参数名称' },
                      ],
                    })(
                      <Input onChange={(e) => { confParam[index] = e.target.value; setConfParam(confParam); }} />
                    )}
                  </Form.Item>
                  <Form.Item label="参数标题（展示）" required {...formItemLayout}>
                    {getFieldDecorator(`params[${index}].name`, {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请填写参数标题（展示）' },
                      ],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item label="参数类型" required {...formItemLayout}>
                    {getFieldDecorator(`params[${index}].type`, {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请选择参数类型' },
                      ],
                    })(
                      <Select>
                        {PARAM_TYPES.map((item: { value: string, title: string }) => (
                          <Select.Option value={item.value} key={item.value} title={item.title}>{item.title}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="参数默认值"  {...formItemLayout}>
                    {getFieldDecorator(`params[${index}].default`, {
                      initialValue: '',
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <MyDivider visible={index !== confParam.length - 1} />
                </div>
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="容器配置" key="container" style={styles.tabPaneStyle}>
            <Form.Item label="镜像" required {...formItemLayout}>
              {getFieldDecorator(`container.image`, {
                initialValue: '',
                rules: [
                  { required: true, message: '请填写镜像' },
                ],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="CPU数" required {...formItemLayout}>
              {getFieldDecorator(`container.cpuNumber`, {
                initialValue: 1,
                rules: [
                  { required: true, message: '请填写CPU数' },
                ],
              })(
                <InputNumber min={1} style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item label="GPU数" required {...formItemLayout}>
              {getFieldDecorator(`container.gpuNumber`, {
                initialValue: 0,
                rules: [
                  { required: true, message: '请填写GPU数' },
                ],
              })(
                <InputNumber min={0} style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item label="内存(MB)" required {...formItemLayout}>
              {getFieldDecorator(`container.memoryMB`, {
                initialValue: 8192,
                rules: [
                  { required: true, message: '请填写内存' },
                ],
              })(
                <InputNumber min={8192} style={{ width: '100%' }} />
              )}
            </Form.Item>

            <Form.Item label="共享内存(MB)" required {...formItemLayout}>
              {getFieldDecorator(`container.shmMB`, {
                initialValue: 64,
                rules: [
                  { required: true, message: '请填写共享内存' },
                ],
              })(
                <InputNumber min={64} style={{ width: '100%' }} />
              )}
            </Form.Item>
            <Form.Item label="可执行命令" required {...formItemLayout}>
              {getFieldDecorator(`container.command`, {
                initialValue: '',
                rules: [
                  { required: true, message: '请填写可执行命令' },
                ],
              })(
                <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />
              )}
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane tab="代码" key="code" style={styles.tabPaneStyle}>
            <Form.Item >
              {getFieldDecorator('code', {
                initialValue: PRESET_CODE,
                rules: [
                  { required: true, message: '请填写代码' },
                ],
              })(
                <AceEditor
                  mode="python"
                  theme="tomorrow"
                  wrapEnabled
                  name="UNIQUE_ID_OF_ACE_EDITOR"
                  style={{ height: 600, lineHeight: 1.4 }}
                  editorProps={{ $blockScrolling: true }}
                // enableBasicAutocompletion={true}
                // enableLiveAutocompletion={true}
                />
              )}
            </Form.Item>

          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
};

const styles = {
  tabPaneStyle: {
    paddingTop: 30
  },
  H3: {
    color: '#999',
    marginBottom: 0,
  }
};

const PRESET_CODE = `
# -*- coding: utf-8 -*-
# 规则：
# runner函数为固定入口，请勿修改
# kwargs参数会传入组件的Param和Inputs，字典形式存储
# return返回是组件的Outputs，key值必须和你的Outputs名称一致

import time

def runner(**kwargs):
    print("Got kwargs: {}".format(kwargs))
    #  开始书写您的代码

    return {}
`;

export default Form.create<OperatorDetailProps>({
  name: 'OperatorDetail',
})(OperatorDetail);