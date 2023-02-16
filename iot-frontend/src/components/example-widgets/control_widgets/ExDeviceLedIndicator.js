import React from "react"

function ExDeviceLedIndicator(props) {
  const {isOn} = props

  return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div
            style={{
              backgroundColor: isOn ? "yellow": "black",
              marginTop: "5px",
              border: "5px solid #000",
              width: "100px",
              height: "100px",
              float: "left",
              WebkitBorderRadius: "100px",
              MozBorderRadius: "100px",
              borderRadius: "100px",
            }}
        />
      </div>
  )
}

export default ExDeviceLedIndicator;