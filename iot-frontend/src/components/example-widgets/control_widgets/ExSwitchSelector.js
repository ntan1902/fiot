import React, {useState} from "react"
import Switch from "react-switch"

const ExSwitchSelector = (props) => {
  const {setIsOn} = props
  const [checked, setChecked] = useState(true)
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Switch
        checked={checked}
        onChange={(checked) => {
          setChecked(checked)
          setIsOn(checked)
        }}
        width={80}
        height={42}
      />
    </div>
  )
}

export default ExSwitchSelector
