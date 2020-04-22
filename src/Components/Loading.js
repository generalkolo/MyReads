import React from 'react'
import ReactLoading from 'react-loading'

const Loading = ({ type = 'cylon', color = '#32a6a8' }) => (
  <ReactLoading type={type} color={color} height={'20%'} width={'20%'} />
)

export default Loading
