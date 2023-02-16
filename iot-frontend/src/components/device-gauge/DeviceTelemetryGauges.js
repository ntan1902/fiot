import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {head} from "lodash";
import * as CanvasGauges from "canvas-gauges"

const {LinearGauge, RadialGauge} = CanvasGauges

const DeviceTelemetryGauges = (props) => {
    const {deviceId} = props;
    const {latestTelemetries} = useSelector((state) => state.telemetries);
    const latestTelemetry = head(latestTelemetries[deviceId])

    const [linearGauge, setLinearGauge] = useState(null)
    const [digitalGauge, setDigitalGauge] = useState(null)

    useEffect(() => {
        const initLinearGauge = new LinearGauge({
            renderTo: 'linear-id',
            colorTitle: "#000000",
            title: latestTelemetry ? latestTelemetry.key.charAt(0).toUpperCase() + latestTelemetry.key.slice(1) : "",
            value: latestTelemetry ? latestTelemetry.value : 0,
            width: 800,
            height: 160,
            borderRadius: 20,
            valueBoxBorderRadius: 0,
            valueTextShadow: false,
            borders: 0,
            minValue: -60,
            maxValue: 100,
            minorTicks: 20,
            majorTicks: [-60, -40, -20, 0, 20, 40, 60, 80, 100],
            units: "°C",
            colorUnits: "#f00",
            animationRule: "linear",
            animationDuration: 700,
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
        }).draw();

        const initDigitalGauge = new RadialGauge({
            renderTo: "radial-id",
            width: 400,
            height: 400,
            units: "°C",
            title: latestTelemetry ? latestTelemetry.key.charAt(0).toUpperCase() + latestTelemetry.key.slice(1) : "",
            value: latestTelemetry ? latestTelemetry.value : 0,
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
        }).draw();

        setLinearGauge(initLinearGauge);
        setDigitalGauge(initDigitalGauge)
    }, [])

    useEffect(() => {
        if (linearGauge !== null) {
            linearGauge.title = latestTelemetry.key
            linearGauge.value = latestTelemetry.value
            setLinearGauge(linearGauge)
        }

        if (digitalGauge !== null) {
            digitalGauge.title = latestTelemetry.key
            digitalGauge.value = latestTelemetry.value
            setDigitalGauge(digitalGauge)
        }
    }, [latestTelemetry])

    return (
        <div style={{overflow: "scroll"}}>
            <div style={{minWidth: "500px"}}>
                <canvas id={"linear-id"}/>
                <canvas id={"radial-id"}/>
            </div>
        </div>
    );
};

export default DeviceTelemetryGauges;
