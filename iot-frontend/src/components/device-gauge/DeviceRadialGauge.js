import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux"
import {uniqBy, get} from "lodash"
import * as CanvasGauges from "canvas-gauges"
import {handleGaugeSettings} from "../../helpers/functions"

const {RadialGauge} = CanvasGauges

const DeviceRadialGauge = (props) => {
  const {dataSources, width, height, settings} = props
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

  const {highlights, majorTicks} = handleGaugeSettings(minValue, maxValue)

  useEffect(() => {
    const initDigitalGauge = new RadialGauge({
      renderTo: `radial-id-${latestTelemetry.key}`,
      width: width * 40,
      height: height * 50,
      units: unit,
      title: latestTelemetry.key ? latestTelemetry.key.charAt(0).toUpperCase() + latestTelemetry.key.slice(1) : "",
      value: latestTelemetry.value ? latestTelemetry.value : 0,
      minValue,
      maxValue,
      minorTicks: 2,
      majorTicks,
      strokeTicks: true,
      highlights,
      colorMajorTicks: "#000000",
      colorMinorTicks: "#000000",
      colorTitle: "#eee",
      colorUnits: "#ccc",
      colorNumbers: "#eee",
      colorPlate: "#222",
      borderShadowWidth: "0",
      borders: "true",
      needleType: "arrow",
      needleWidth: "2",
      needleCircleSize: "7",
      needleCircleOuter: "true",
      needleCircleInner: "false",
      animationDuration: 1000,
      animationRule: "bounce",
      colorBorderOuter: "#333",
      colorBorderOuterEnd: "#111",
      colorBorderMiddle: "#222",
      colorBorderMiddleEnd: "#111",
      colorBorderInner: "#111",
      colorBorderInnerEnd: "#333",
      colorNeedleShadowDown: "#333",
      colorNeedleCircleOuter: "#333",
      colorNeedleCircleOuterEnd: "#111",
      colorNeedleCircleInner: "#111",
      colorNeedleCircleInnerEnd: "#222",
      valueBoxBorderRadius: "0",
      colorValueBoxRect: "#222",
      colorValueBoxRectEnd: "#333",
      fontValue: "Led",
      fontNumbers: "Led",
      fontTitle: "Led",
      fontUnits: "Led",
    }).draw()

  }, [latestTelemetry, width, height])

  return (
    <div
      style={{
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
        background: "transparent",
      }}
    >
      <canvas id={`radial-id-${latestTelemetry.key}`} />
    </div>
  )
}

export default DeviceRadialGauge
