import React, {useEffect} from "react"
import * as CanvasGauges from "canvas-gauges"

const {RadialGauge} = CanvasGauges

const ExRadialGauge = (props) => {
  useEffect(() => {
    new RadialGauge({
      renderTo: "radial-id",
      width: 300,
      height: 300,
      units: "°C",
      title: "",
      value: 0,
      minValue: -60,
      maxValue: 100,
      minorTicks: 2,
      majorTicks: [-60, -40, -20, 0, 20, 40, 60, 80, 100],
      strokeTicks: true,
      highlights: [
        {from: -60, to: -40, color: "#87C6FB"},
        {from: -40, to: -20, color: "#B1DAFC"},
        {from: -20, to: 0, color: "#D7EDFE"},
        {from: 0, to: 20, color: "#FFD5D6"},
        {from: 20, to: 40, color: "#FFAAAD"},
        {from: 40, to: 60, color: "#FF7C83"},
        {from: 60, to: 80, color: "#FF4458"},
        {from: 80, to: 100, color: "#FF002A"},
      ],
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
  }, [])

  return (
    <div style={{alignSelf: "center", alignContent: "center", alignItems: "center"}}>
      <canvas id={"radial-id"} />
    </div>
  )
}

export default ExRadialGauge
