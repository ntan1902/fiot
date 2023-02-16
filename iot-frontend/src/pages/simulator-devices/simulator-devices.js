import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import LayoutEntity from "../../components/layout/LayoutEntity"
import SimulatorDevices from "../../components/simulator-device/SimulatorDevices"
import {loadSimulatorDevices} from "../../actions/simulatorDevices"

const SimulatorDevicesPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
      dispatch(loadSimulatorDevices())
  }, [])

  return (
    <LayoutEntity>
      <SimulatorDevices />
    </LayoutEntity>
  )
}

export default SimulatorDevicesPage
