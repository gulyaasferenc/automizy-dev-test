import React, { useState, useEffect } from 'react'
import { Spin, Modal, Select } from 'antd'
import axios from 'axios'
const { Option } = Select

const AssociateModal = ({ items, visible, inputId, onCancel }) => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [allItems, setAllItems] = useState({
    data: [],
    completed: true,
    error: false
  })
  const onOk = () => {
    const body = {}
    if (items === 'students') {
      body.student_id = selectedItem.id
      body.project_id = inputId
    } else {
      body.student_id = inputId
      body.project_id = selectedItem.id
    }
    axios.post('api/management/', body)
    onCancel()
  }
  useEffect(() => {
    setAllItems({
      ...allItems,
      completed: false
    })
    const specifics = {}
    if (items === 'projects') {
      specifics.apiUrl = 'api/project'
      specifics.prop = 'projects'
    } else {
      specifics.apiUrl = 'api/student'
      specifics.prop = 'students'
    }
    axios.get(specifics.apiUrl)
      .then(res => {
        setAllItems({
          data: res.data[specifics.prop],
          error: false,
          completed: true
        })
      })
      .catch(err => {
        setAllItems({
          data: null,
          error: true,
          completed: true
        })
      })
  }, [0])

  return (
    <Spin
      size="large"
      spinning={!allItems.completed}>
      {allItems.completed && allItems.error ? null : <Modal
        title={items === "projects" ? "Select project to assign" : "Select student to assign"}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder={items === "students" ? "Select a Student" : "Select a Project"}
          optionFilterProp="children"
          onChange={(event) => { setSelectedItem(JSON.parse(event)) }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {allItems.data.map((x, i) => { return <Option key={i} value={JSON.stringify(x)} >{x.first_name ? `${x.first_name} ${x.last_name}` : x.name}</Option> })}
        </Select>
      </Modal>}
    </Spin>

  )
}

export default AssociateModal