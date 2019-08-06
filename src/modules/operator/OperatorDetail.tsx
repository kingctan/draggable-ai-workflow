import React, { useState, SyntheticEvent } from 'react';
import { Form, Radio, Input, Select, Tabs, Icon, Button, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { v4 } from 'uuid';
import { formItemLayout, tailFormItemLayout } from '../../utils/FormLayout';
import { Link } from 'react-router-dom';
import { OperatorConfigParam } from './OperatorProps';
import './operator.styl';

type Props = {

};


interface OperatorDetailProps extends FormComponentProps {

};

const componentTypes = ['数据', '数据处理', '算法', '评估', '报表'];

const generateInputName = () => `input-${v4().slice(-4)}`;

const generateOutputName = () => `output-${v4().slice(-4)}`;

const OperatorDetail: React.FC<Props & OperatorDetailProps> = (props) => {
  const { } = props;
  const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, setFieldsValue } = props.form;

  const [tab, setTab] = useState('input');
  const [confInput, setConfInput] = useState<string[]>([generateInputName()]);
  const [confOutput, setConfOutput] = useState<string[]>([generateOutputName()]);
  const [confParam, setConfParam] = useState<string[]>([]);

  const handleChangeTab = (activeKey: string) => setTab(activeKey);

  const handleAddInput = () => setConfInput([...confInput, generateInputName()]);

  const handleAddOutput = () => setConfOutput([...confOutput, generateOutputName()]);

  return (
    <div>
      <div className="main-toolbar">
        <Link to="/operator-list">
          <Button><Icon type="caret-left" /> 返回列表</Button>
        </Link>
        <Divider type="vertical" />
        <Button type="primary" style={{ marginLeft: 20 }}>
          <Icon type="check" /> 确认保存
        </Button>
        {
          tab === 'input' &&
          <Button onClick={handleAddInput}><Icon type="plus-square" /> 新增输入</Button>
        }
        {
          tab === 'output' &&
          <Button onClick={handleAddOutput}><Icon type="plus-square" /> 新增输出</Button>
        }
        {
          // tab === 'param' &&
          // <Button onClick={handleAddParam}><Icon type="plus-square" /> 新增参数</Button>
        }
      </div>
      <Form onSubmit={() => { }}>
        <Tabs activeKey={tab} onChange={handleChangeTab}>
          <Tabs.TabPane tab="基础属性" key="basic" style={styles.tabPaneStyle}>
            <Form.Item label="算子名称" required {...formItemLayout}>
              {getFieldDecorator('componentName', {
                rules: [{
                  required: true,
                  message: '请填写算子名称',
                }],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="算子类型" required {...formItemLayout}>
              {getFieldDecorator('type', {
                rules: [{
                  required: true,
                  message: '请选择算子类型',
                }],
              })(
                <Select>
                  {componentTypes.map((item: any) => (
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
                  <Form.Item {...tailFormItemLayout}>
                    <h3 style={styles.H3}>
                      {inputName}
                      <Icon
                        type="close-square"
                        className="config-delete-btn"
                        onClick={() => setConfInput([...confInput.slice(0, index), ...confInput.slice(index + 1)])}
                      />
                    </h3>
                  </Form.Item>
                  <Form.Item label="输入名称" required {...formItemLayout}>
                    {getFieldDecorator(`input[${index}].name`, {
                      initialValue: inputName,
                      rules: [
                        { required: true, message: '请填写输入名称' },
                      ],
                    })(
                      <Input onChange={(e) => { confInput[index] = e.target.value; setConfInput(confInput); }} />
                    )}
                  </Form.Item>
                  <Form.Item label="输入类型" required {...formItemLayout}>
                    {getFieldDecorator(`input[${index}].type`, {
                      initialValue: 'data',
                      rules: [
                        { required: true, message: '请选择输入类型' },
                      ],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item label="输入描述" required {...formItemLayout}>
                    {getFieldDecorator(`input[${index}].note`, {
                      initialValue: '',
                      rules: [
                        { required: true, message: '请选择输入描述' },
                      ],
                    })(
                      <Input.TextArea autosize={{ minRows: 3, maxRows: 8 }} />
                    )}
                  </Form.Item>
                  {
                    index !== confInput.length - 1 &&
                    <Form.Item {...tailFormItemLayout}>
                      <Divider />
                    </Form.Item>
                  }

                </div>
              ))
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab="输出配置" key="output" style={styles.tabPaneStyle}>

          </Tabs.TabPane>
          <Tabs.TabPane tab="可调参数" key="param" style={styles.tabPaneStyle}>

          </Tabs.TabPane>
          <Tabs.TabPane tab="代码" key="code" style={styles.tabPaneStyle}>

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

export default Form.create<OperatorDetailProps>({
  name: 'OperatorDetail',
})(OperatorDetail);