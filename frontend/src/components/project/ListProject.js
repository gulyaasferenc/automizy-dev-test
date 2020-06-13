import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Layout,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Modal,
  message,

  Collapse
} from 'antd'
const { confirm } = Modal
const { Panel } = Collapse
import { ExclamationCircleOutlined } from '@ant-design/icons'

const ListProject = ({ reloadListTrigger }) => {
  const [trigger, setTrigger] = useState()
  const [loader, setLoader] = useState(true)

  const [list, setList] = useState({
    data: null,
    complete: false,
    error: false
  })
  // Projectk betöltése
  useEffect(
    () => {
      setLoader(true)
      setList({
        data: list.data,
        error: false,
        complete: false
      })
      axios.get('api/project')
        .then(res => {
          setLoader(false)
          setList({
            data: res.data,
            error: false,
            complete: true
          })
        }
        )
        .catch(() => {
          setLoader(false)
          setList({
            data: null,
            error: true,
            complete: true
          })
        }
        )
    },
    [trigger, reloadListTrigger]
  )
  // Adott project törlésére kattinttás
  const onClickDeleteProject = ({ event, name, id }) => {
    confirm({
      title: 'Are you sure delete this project?',
      icon: <ExclamationCircleOutlined />,
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProject({ name: name, id: id })
      },
      onCancel() { }
    })
    event.stopPropagation()
  }
  // Project törlése
  const deleteProject = ({ id, name }) => {
    setLoader(true)
    axios.delete('api/project/' + id)
      .then(res => {
        message.success('The following project has been deleted: ' + name)
        setLoader(false)
        setTrigger(new Date().getTime())
      }
      )
      .catch(() =>
        setLoader(false)
      )
  }
  return (
    <Spin
      size="large"
      spinning={loader}>
      <Row style={{ marginTop: 8, marginBottom: 8 }}>
        <Col span={24}>
          {(list.complete && list.error ? 
          <div>Something went wrong!</div>
          : list.complete && (
            list.data &&
              list.data.projects.length ?
              <Collapse>
                {list.data.projects.map((item, i) => {
                  return (
                    <Panel key={i} header={item.name} extra={(
                      <Button
                        type="primary"
                        onClick={(event = event, id = item.id, name = item.name) => onClickDeleteProject({ event: event, id: id, name: name })}>
                        Delete
                      </Button>
                    )}>
                      <div>{item.description}</div>
                    </Panel>)
                })}
              </Collapse>
              :
              <Empty />
          ))}
        </Col>
      </Row>
    </Spin>
  )
}

export default ListProject