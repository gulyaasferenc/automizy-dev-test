/**
 * List all of the projects on project main page
 */

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
  Divider,
  Collapse,
  Input
} from 'antd'
const { confirm } = Modal
const { Search } = Input
const { Panel } = Collapse
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AddProjectModal from './AddProjectModal'

const ListProject = ({ reloadListTrigger }) => {
  const [trigger, setTrigger] = useState()
  const [loader, setLoader] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [itemToModal, setItemToModal] = useState(null)
  const [searchValue, setSearchValue] = useState(null)

  const [list, setList] = useState({
    data: null,
    complete: false,
    error: false
  })
  useEffect(
    () => {
      setLoader(true)
      setList({
        data: list.data,
        error: false,
        complete: false
      })
      let endpoint = ''
    if (searchValue) {
      endpoint = `api/project/search/${searchValue}`
    } else {
      endpoint = 'api/project'
    }
      axios.get(endpoint)
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
    [trigger, reloadListTrigger, searchValue]
  )
  // Click on project
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
  // Delete project
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

  // open form and load project data into it
  const onClickEditProject = ({event, inItem}) => {
    setItemToModal(inItem)
    setShowModal(true)
    event.stopPropagation()
  }

  const onClickCancel = () => {
    setShowModal(false)
  }
  const onDone = ({ name }) => {
    setShowModal(false)
    setTrigger(new Date().getTime())
    message.success('The following project has been saved: ' + name)
  }

  // Click on search
  const onSearch = (value) => {
    setSearchValue(value)
  }

  return (
    <Spin
      size="large"
      spinning={loader}>
         <Search
        placeholder="Enter project name"
        enterButton="Search"
        size="large"
        onSearch={value => onSearch(value)} />
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
                        <div>
                          <Button
                            type="primary"
                            onClick={(event = event, inItem = item) => onClickEditProject({event: event, inItem: inItem})}>
                            Edit
                          </Button>
                          <Divider type="vertical" />
                          <Button
                            type="danger"
                            onClick={(event = event, id = item.id, name = item.name) => onClickDeleteProject({ event: event, id: id, name: name })}>
                            Delete
                          </Button>
                        </div>)} >
                      <div>{item.description}</div>
                      </Panel>)
                  })}
                </Collapse>
                :
                <Empty />
            ))}
        </Col>
        {showModal ? <AddProjectModal item={itemToModal} onClickCancel={onClickCancel} onDone={onDone} /> : null}
      </Row>
    </Spin >
  )
}

export default ListProject