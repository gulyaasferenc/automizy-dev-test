import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Divider, Spin, Empty, List, Card, Typography, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal
const { Title, strong } = Typography
const { Header, Content } = Layout

const StudentsForProject = ({project_id}) => {
  const [projectAssociations, setProjectAssociations] = useState({
    data: null,
    complete: false,
    error: false
  })

  useEffect(() => {
    axios.get(`api/management/project/${project_id}`)
      .then(res => {
        console.log(res.data)
        setProjectAssociations({
          data: res.data.managements,
          complete: true,
          error: false
        })
      })
      .catch(err => {
        console.error(err)
        setProjectAssociations({
          data: null,
          error: true,
          complete: true
        })
      })
  }, [0])

  const onClickDeleteStudentfromProject = ({ name, id }) => {
    confirm({
      title: 'Are you sure delete this student from the affected project?',
      icon: <ExclamationCircleOutlined />,
      content: name,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteStudent({ name: name, id: id })
      },
      onCancel() { }
    })
  }
  // Project törlése
  const deleteStudent = ({ id, name }) => {
    setSpinner(true)
    axios.delete('api/management/' + id)
      .then(res => {
        message.success('The following project has been deleted: ' + name)
        setSpinner(false)
        setTrigger(new Date().getTime())
      }
      )
      .catch(() =>
        setSpinner(false)
      )
  }

  return (
    <Row>
      {projectAssociations.complete && projectAssociations.data && projectAssociations.data.length ? <List
      span={24}
        dataSource={projectAssociations.data}
        renderItem={item => (
          <List.Item>
            <Row justify="center" span={24}>
              <Col span={20}>
                <strong>
                  {`${item.first_name} ${item.last_name}`}
                </strong>
              </Col>
              <Col span={4}>
                <Button
                  size="small"
                  type="primary"
                  onClick={({ id = item.id, name = `${item.first_name} ${item.last_name}`, }) => onClickDeleteStudentfromProject({ id: id, name: name })}>
                  Delete
                </Button>
              </Col>
            </Row>

          </List.Item>
        )}
      /> : <Empty />}
    </Row>
  )
}

export default StudentsForProject