import React, {useEffect, useState} from "react";
import Switch from "react-switch";
import {DeviceApi} from "../../api";
import {get} from "lodash";

let checkStatusInterval = null
const DeviceSwitchSelector = (props) => {
  // settings: {"getMethod": "getTemperature", "setMethod": "setTemperature", "deviceId": "deviceId", }
  const {settings, width, height} = props
  const [checked, setChecked] = useState(true);
  const itemWidth = width * 40;
  const itemHeight = height * 50;

  const deviceId = settings && settings.deviceId

  useEffect(() => {
    const rpcRequestInterval = get(settings, "rpcRequestInterval", 5000)
    checkStatusInterval = setInterval(async () => {
      if (deviceId) {
        const value = await DeviceApi.rpcRequest(
            deviceId,
            {
              method: settings.getMethod,
              params: {}
            }
        );
        setChecked(!!value)
      }
    }, rpcRequestInterval)

    return () => {
      if (checkStatusInterval) {
        clearInterval(checkStatusInterval)
      }
    }
  }, [])

  const handleChange = (value) => {
    setChecked(value);

    DeviceApi.rpcRequest(
        deviceId,
        {
          method: settings.setMethod,
          params: value
        }
    );
  }

  return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Switch checked={checked} onChange={handleChange} width={80} height={42}/>
      </div>
  );
};

export default DeviceSwitchSelector;
