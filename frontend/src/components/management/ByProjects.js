import React, { useState, useEffect } from 'react'
import { Spin, Empty, List, Card, Button, Tooltip } from 'antd'
import axios from 'axios'
import AssociateModal from './AssociateModal'
import StudentsForProject from './StudentsForProject'

const ByProjects = () => {
  const [projects, setProjects] = useState({
    data: null,
    complete: false,
    error: false
  })
  const [spinner, setSpinner] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [inputId, setInputId] = useState(null)
  const [myKey, setMyKey] = useState(0)

  useEffect(() => {
    setSpinner(true)
    axios.get('api/project')
      .then(res => {
        setSpinner(false)
        setProjects({
          data: res.data.projects,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.log(err)
        setSpinner(false)
        setProjects({
          data: null,
          error: true,
          complete: true
        })
      })

  }, [setProjects, myKey])

  const openModal = (id) => {
    setInputId(id)
    setModalVisible(true)
  }

  const onModalCancel = () => {
    let currentKey = myKey
    setModalVisible(false)
    setMyKey(currentKey + 1)
  }

  return (
    <Spin
      size="large"
      spinning={spinner}>
      {projects.complete && projects.error ?
      <div>Something went wrong!</div> 
      : projects.data && projects.complete && projects.data.length ? <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={projects.data}
        renderItem={item => (
          <List.Item key={myKey}>
            <Card title={item.name} extra={<Tooltip title="Assign Student"><Button onClick={() => {openModal(item.id)}}>+</Button></Tooltip>}>
              <StudentsForProject onCancel={onModalCancel} project_id={item.id} />
            </Card>
          </List.Item>
        )}
      /> : <Empty />}
      <AssociateModal visible={modalVisible} onCancel={onModalCancel} inputId={inputId} items='students' />
    </Spin>
  )
}

export default ByProjects