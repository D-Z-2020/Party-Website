import React, { useEffect, useState } from 'react'
import './index.scss'
import logo from '@/assets/logo.png';
import { Button, Form, Input, Space, Switch, Dropdown } from 'antd';
import { CheckOutlined, CloseOutlined, AlignCenterOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
export default function PartySpaceSeting() {
    const [renderLink, setRenderLink] = useState(false)
    const [renderNav, setRenderNav] = useState(false)
    const rules = [{ required: true }]
    const [form] = useForm()

    const items = [
        {
            key: 'Logout',
            label: 'Logout'
        },
        {
            key: 'My Party Space',
            label: 'My Party Space'
        },
        {
            key: 'Party settings',
            label: 'Party settings'
        },
    ]

    const submit = () => {
        form.validateFields().then(values => {
            console.log('提交表单submit', values);
        })
    }

    const back = () => {
        console.log('返回主页party space');
    }

    const menuClick = ({ key }) => {
        console.log('菜单项点击',  key);
    }

    useEffect(() => {
        if (document.body.clientWidth > 390) setRenderNav(true)
        else setRenderNav(false)
    }, [document.body.clientWidth])
    return (
        <div className='party-space-seting bese'>
            <header>
                <img src={logo} />
                {
                    renderNav
                        ?
                        <div>
                            <Space>
                                <Button type='link'>My Party Space</Button>
                                <Button type='link'>Party settings</Button>
                                <Button type='primary' shape="round">Logout</Button>
                            </Space>
                        </div>
                        :
                        <div>
                            <Dropdown getPopupContainer={e => e} trigger={['click']} menu={{ items, onClick: menuClick }} >
                                <Button icon={<AlignCenterOutlined />}></Button>
                            </Dropdown>
                        </div>
                }
            </header>
            <div className='main'>
                <section>
                    <h1>Party Space Settings</h1>
                    <Form
                        form={form}
                        labelAlign='left'
                        requiredMark={false}
                        labelCol={{ xs: 4, sm: 6 }}
                        wrapperCol={{ xs: 20, sm: 18 }}
                    >
                        <Form.Item label='Party name' name={'name'} rules={rules}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Location" name={'location'} rules={rules}>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Time' name={'time'} rules={rules}>
                            <Input />
                        </Form.Item>
                        <Form.Item rules={rules} valuePropName='checked' initialValue={true} name={'music'} label='Music Controller' className='item-no-wrap'>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined style={{ color: 'black' }} />}
                            />
                        </Form.Item>
                        <Form.Item rules={rules} valuePropName='checked' initialValue={false} name={'game'} label='Game' className='item-no-wrap'>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined style={{ color: 'black' }} />}
                            />
                        </Form.Item>
                        <Form.Item
                            noStyle
                            shouldUpdate={(_pre, cur) => {
                                if (cur.game) {
                                    setRenderLink(true)
                                } else {
                                    setRenderLink(false)
                                }
                            }}
                        >
                            {() => {
                                if (renderLink)
                                    return (
                                        <Form.Item rules={rules} name={'link'} label='Game link'>
                                            <Input />
                                        </Form.Item>
                                    );
                                return
                            }}
                        </Form.Item>
                        <Form.Item rules={rules} valuePropName='checked' name={'photos'} initialValue={false} label='Photos Sharing' className='item-no-wrap'>
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined style={{ color: 'black' }} />}
                            />
                        </Form.Item>
                        <div className='form-btns'>
                            <Button onClick={back} type='ghost' shape="round" className='back-btn'>Back to Party Space</Button>
                            <Button onClick={submit} type='primary' shape="round">SAVE</Button>
                        </div>
                    </Form>
                </section>
            </div>
        </div>
    )
}
