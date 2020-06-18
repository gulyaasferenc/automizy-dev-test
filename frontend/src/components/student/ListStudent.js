import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Layout,
  Row,
  Col,
  Spin,
  Empty,
  List,
  Typography,
  Button,
  Modal,
  Divider,
  message,
  Input
} from 'antd'
const { Title } = Typography
const { confirm } = Modal
const { Search } = Input
import { ExclamationCircleOutlined } from '@ant-design/icons'
import AddStudentModal from './AddStudentModal'
import "../../layout/Layout.css"


const ListStudent = ({ reloadListTrigger }) => {
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

  // Tanulók betöltése
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
        endpoint = `api/student/search/${searchValue}`
      } else {
        endpoint = 'api/student'
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
    [searchValue, trigger, reloadListTrigger]
  )


  // Adott tanuló törlésére kattinttás
  const onClickDeleteStudent = ({ name, id }) => {
    confirm({
      title: 'Are you sure delete this student?',
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
  // Tanuló törlése
  const deleteStudent = ({ id, name }) => {
    setLoader(true)
    axios.delete('api/student/' + id)
      .then(res => {
        message.success('The following student has been deleted: ' + name)
        setLoader(false)
        setTrigger(new Date().getTime())
      }
      )
      .catch(() =>
        setLoader(false)
      )
  }
  const onClickEditStudent = (inItem) => {
    setItemToModal(inItem)
    setShowModal(true)
  }

  const onClickCancel = () => {
    setShowModal(false)
  }
  const onDone = ({ name }) => {
    setShowModal(false)
    setTrigger(new Date().getTime())
    message.success('The following student has been saved: ' + name)
  }
  const onSearch = (value) => {
    setSearchValue(value)
  }
  return (
    <Spin
      size="large"
      spinning={loader}>
      <Search
        placeholder="Enter student email"
        enterButton="Search"
        size="large"
        onSearch={value => onSearch(value)} />
      <Row style={{ marginTop: 8, marginBottom: 8 }}>
        <Col span={24}>
          {(list.complete && list.error ? <div>Something went wrong!</div>
            : list.complete && (
              list.data && list.data.students &&
                list.data.students.length ?
                <List
                  bordered
                  dataSource={list.data.students}
                  renderItem={item => (
                    <List.Item>
                      <Col span={20} >
                        <Typography.Text strong>
                          {item.first_name} {item.last_name}
                        </Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text>
                          {item.email}
                        </Typography.Text>
                      </Col>
                      <Col span={4} style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          onClick={({ inItem = item }) => onClickEditStudent(inItem)}>
                          Edit
                      </Button>
                        <Divider type="vertical" />
                        <Button
                          type="danger"
                          onClick={({ id = item.id, name = item.first_name + " " + item.last_name }) => onClickDeleteStudent({ id: id, name: name })}>
                          Delete
                    </Button>
                      </Col>

                    </List.Item>
                  )}
                />
                :
                <Empty />
            ))}
          {showModal ? <AddStudentModal item={itemToModal} onClickCancel={onClickCancel} onDone={onDone} /> : null}
        </Col>
      </Row>
    </Spin>
  )
}

export default ListStudent