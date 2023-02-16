import React, {useEffect, useRef, useState} from "react"
import {useSelector} from "react-redux"
import {uniqBy, get} from "lodash"
import * as CanvasGauges from "canvas-gauges"
import {handleGaugeSettings} from "../../helpers/functions"

const {LinearGauge} = CanvasGauges

const DeviceLinearGauges = (props) => {
  const {dataSources, settings, width, height} = props
  const deviceId = Object.keys(dataSources)[0]
  const {latestTelemetries} = useSelector((state) => state.telemetries)

  let latestTelemetry = {}
  const uniqueKvs = uniqBy(latestTelemetries[deviceId], "key")

  for (const {key, value} of uniqueKvs) {
    if (key === dataSources[deviceId][0]) {
      latestTelemetry.key = key
      latestTelemetry.value = value
    }
  }

  const minValue = parseInt(get(settings, 'minRange'))
  const maxValue = parseInt(get(settings, 'maxRange'))
  const unit = get(settings, 'unit')

  const {highlights, majorTicks} =  handleGaugeSettings(minValue, maxValue)

  const linearGauge = useRef()

  useEffect(() => {
    linearGauge.current = new LinearGauge({
      renderTo: `linear-id-${latestTelemetry.key}`,
      colorTitle: "#000000",
      title: latestTelemetry.key ? latestTelemetry.key.charAt(0).toUpperCase() + latestTelemetry.key.slice(1) : "",
      value: latestTelemetry.value ? latestTelemetry.value : 0,
      width: width * 46,
      height: height * 50,
      borderRadius: 20,
      valueBoxBorderRadius: 0,
      valueTextShadow: false,
      borders: 0,
      minValue,
      maxValue,
      minorTicks: 20,
      majorTicks,
      units: unit,
      colorUnits: "#f00",
      animationRule: "linear",
      animationDuration: 700,
      highlights,
    })

  }, [width, height])

  useEffect(() => {
    if (linearGauge !== null) {
      linearGauge.current.title = latestTelemetry.key
      linearGauge.current.value = latestTelemetry.value
      linearGauge.current.draw()
    }
  }, [latestTelemetry])

  return <canvas id={`linear-id-${latestTelemetry.key}`}/>
}

export default DeviceLinearGauges
