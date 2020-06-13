import React, { useState, useEffect } from 'react'
import { Spin, Empty, List, Card, Button, Modal, Tooltip } from 'antd'
import axios from 'axios'
import ProjectsForOneStudent from './ProjectsForOneStudent'
import AssociateModal from './AssociateModal'


const ByStudents = () => {
  const [students, setStudents] = useState({
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
    axios.get('api/student')
      .then(res => {
        console.log(res.data)
        setSpinner(false)
        setStudents({
          data: res.data.students,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.error(err)
        setSpinner(false)
        setStudents({
          data: null,
          error: true,
          complete: true
        })
      })

  }, [setStudents, myKey])

  const openModal = (id) => {
    setInputId(id)
    setModalVisible(true)
  }

  const onModalCancel = () => {
    let currentKey = myKey
    setModalVisible(false)
    setMyKey(currentKey + 1)
    console.log(myKey)
  }
  return (
    <Spin
      size="large"
      spinning={spinner}>
      {students.complete && students.error ? 
      <div>Something went wrong!</div>
      :students.data && students.complete && students.data.length ? <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={students.data}
        renderItem={item => (
          <List.Item key={myKey}>
            <Card title={`${item.first_name} ${item.last_name}`} extra={<Tooltip title="Assign Project"><Button onClick={() => {openModal(item.id)}}>+</Button></Tooltip>}>
              <ProjectsForOneStudent onCancel={onModalCancel} student_id={item.id} />
            </Card>
          </List.Item>
        )}
      /> : <Empty />}
      <AssociateModal visible={modalVisible} onCancel={onModalCancel} inputId={inputId} items='projects' />
    </Spin>
  )
}

export default ByStudents