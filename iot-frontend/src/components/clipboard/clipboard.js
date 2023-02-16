import React from "react";
import copy from 'copy-to-clipboard'
import {Button, message,} from "antd";

const Clipboard = (props) => {
  const {label, copyText, ...restProps} = props
  const handleCopy = () => {
    copy(copyText)
    message.success(`${copyText} has been copied to clipboard`)
  }

  return (
    <Button
      className={restProps.className}
      icon="copy"
      type="primary" 
      onClick={handleCopy}>
      {label}
    </Button>
  )
}

export default Clipboard