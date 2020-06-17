import React, { useState, useEffect } from 'react'
import { Spin, Empty, List, Card, Button, Input, Tooltip } from 'antd'
const { Search } = Input
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
  const [searchValue, setSearchValue] = useState(null)

  useEffect(() => {
    setSpinner(true)
    let endpoint = ''
    if (searchValue) {
      endpoint = `api/student/search/${searchValue}`
    } else {
      endpoint = 'api/student'
    }
    axios.get(endpoint)
      .then(res => {
        setSpinner(false)
        setStudents({
          data: res.data.students,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.log(err)
        setSpinner(false)
        setStudents({
          data: null,
          error: true,
          complete: true
        })
      })

  }, [setStudents, myKey, searchValue])

  const openModal = (id) => {
    setInputId(id)
    setModalVisible(true)
  }

  const onModalCancel = () => {
    let currentKey = myKey
    setModalVisible(false)
    setMyKey(currentKey + 1)
  }

  const onSearch = (value) => {
    setSearchValue(value)
  }
  return (
    <Spin
      size="large"
      spinning={spinner}>
      <Search
        placeholder="Enter user first name OR last name"
        enterButton="Search"
        size="large"
        onSearch={value => onSearch(value)}
        style={{marginBottom: '1rem'}} />
      {students.complete && students.error ?
        <div>Something went wrong!</div>
        : students.data && students.complete && students.data.length ? <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={students.data}
          renderItem={item => (
            <List.Item key={myKey}>
              <Card title={`${item.first_name} ${item.last_name}`} extra={<Tooltip title="Assign Project"><Button onClick={() => { openModal(item.id) }}>+</Button></Tooltip>}>
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