import {get} from "lodash"
import React, {useEffect, useState} from "react"
import {DeviceApi} from "../../api"

const ledStyle = {
  yellow: {
    backgroundColor: "yellow",
  },
  black: {
    backgroundColor: "black",
  },
}

let checkStatusInterval = null

function DeviceLedIndicator(props) {
  const {settings, width, height} = props
  const itemWidth = width * 40
  const itemHeight = height * 50
  const [ledColor, setLedColor] = useState(ledStyle.yellow)
  const deviceId = settings && settings.deviceId

  useEffect(() => {
    const rpcRequestInterval = get(settings, "rpcRequestInterval", 5000)
    const getMethod = get(settings, "getMethod", "getValue")
    checkStatusInterval = setInterval(async () => {
      if (deviceId) {
        const value = await DeviceApi.rpcRequest(deviceId, {
          method: getMethod,
          params: {},
        })
        setLedColor(!!value ? ledStyle.yellow : ledStyle.black)
      }
    }, rpcRequestInterval)

    return () => {
      if (checkStatusInterval) {
        clearInterval(checkStatusInterval)
      }
    }
  }, [])

  return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div
            style={{
              ...ledColor, marginTop: "5px",
              border: "5px solid #000",
              width: itemWidth,
              height: itemHeight,
              float: "left",
              WebkitBorderRadius: "100px",
              MozBorderRadius: "100px",
              borderRadius: "100px",
            }}
        />
      </div>
  )
}

export default DeviceLedIndicator;