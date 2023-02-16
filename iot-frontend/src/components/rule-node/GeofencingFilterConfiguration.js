import React, {useEffect, useRef, useState} from "react";
import {Col, Form, Input, message, Row, Select} from "antd";
import {Circle, FeatureGroup, MapContainer, Polygon, TileLayer} from "react-leaflet";
import {EditControl} from "react-leaflet-draw";
import L from "leaflet"
import conversions from "conversions/dist/conversions";
import {useSelector} from "react-redux";
import {uniqBy} from "lodash";
import DeviceMarkers from "../device-maps/DeviceMarkers";

const {Option} = Select;
let latitude = 21.042818001881113;
let longitude = 105.82232502410294;

const GeofencingFilterConfiguration = (props) => {
  const {
    setName,
    label,
    setConfig,
    submitForm,
    setSubmitForm,
    setSubmitDone,
    form,
    defaultConfig
  } = props;

  const [perimeterType, setPerimeterType] = useState(defaultConfig.perimeter.perimeterType)
  const featureGroupRef = useRef()

  const {getFieldDecorator} = form;

  const [markers, setMarkers] = useState([])

  const {latestTelemetries} = useSelector((state) => state.telemetries);

  useEffect(() => {

    const deviceIds = latestTelemetries && Object.keys(latestTelemetries)
    const markerList = []

    for (let deviceId of deviceIds) {
      const uniqueKvs = uniqBy(latestTelemetries[deviceId], "key");
      const marker = {
        latitude: null,
        longitude: null
      }

      for (const {key, value} of uniqueKvs) {
        marker[key] = value
      }

      if (marker.latitude !== null && marker.longitude != null) {
        markerList.push(marker)
      }
    }

    if (markerList.length > 0) {
      setMarkers(markerList)
    }
  }, [latestTelemetries])

  useEffect(() => {
    if (submitForm) {
      form.validateFields(
          [
            "name",
            "latitudeKey",
            "longitudeKey",
            "perimeterType",
            "polygonLatLngs",
            "centerLatitude",
            "centerLongitude",
            "range",
            "rangeUnit",
          ],
          (err, values) => {
            if (!err) {
              setName(values.name);
              setConfig(
                  JSON.stringify({
                    latitudeKey: values.latitudeKey,
                    longitudeKey: values.longitudeKey,
                    perimeter: {
                      perimeterType: values.perimeterType,

                      polygonLatLngs: values.perimeterType === 'POLYGON' ? values.polygonLatLngs : null,

                      centerLatitude: values.perimeterType === 'CIRCLE' ? values.centerLatitude : 0,
                      centerLongitude: values.perimeterType === 'CIRCLE' ? values.centerLongitude : 0,
                      range: values.perimeterType === 'CIRCLE' ? values.range : 0,
                      rangeUnit: values.perimeterType === 'CIRCLE' ? values.rangeUnit : 0,
                    }
                  })
              );

              message.success(`${label ? "Save" : "Create"} rule node successfully!`);
              form.resetFields();

              setSubmitDone(true)
            }
            setSubmitForm(false)
          }
      );
    }
  }, [submitForm])

  function clearPreviousLayer() {
    const layers = featureGroupRef.current._layers;
    if (Object.keys(layers).length > 1) {
      const layerId = Object.keys(layers)[0]
      const removingLayer = layers[layerId];
      featureGroupRef.current.removeLayer(removingLayer)
    }
  }

  const _onCreated = e => {
    const {layer, layerType} = e;

    if (layerType === 'circle') {
      setPerimeterType('CIRCLE')
      const rangeUnitValue = form.getFieldValue("rangeUnit")
      if (!rangeUnitValue) {
        form.setFieldsValue({
          perimeterType: 'CIRCLE',
          range: layer.getRadius(),
          rangeUnit: "METER",

          centerLatitude: layer.getLatLng().lat,
          centerLongitude: layer.getLatLng().lng,
        })
      } else {
        form.setFieldsValue({
          range: conversions(layer.getRadius(), "METER".toLowerCase(), rangeUnitValue.toLowerCase()),
          centerLatitude: layer.getLatLng().lat,
          centerLongitude: layer.getLatLng().lng,
        })
      }
    } else if (layerType === 'polygon') {
      setPerimeterType('POLYGON')
      form.setFieldsValue({
        perimeterType: 'POLYGON',
        polygonLatLngs: JSON.stringify(layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]))
      })
    }
    clearPreviousLayer();
  }

  const _onEdited = e => {
    const layer = Object.values(e.layers._layers)[0]

    if (layer.getRadius()) {
      const rangeUnitValue = form.getFieldValue("rangeUnit")
      form.setFieldsValue({
        range: conversions(layer.getRadius(), "METER".toLowerCase(), rangeUnitValue.toLowerCase()),
        centerLatitude: layer.getLatLng().lat,
        centerLongitude: layer.getLatLng().lng,
      })
    } else {
      form.setFieldsValue({
        polygonLatLngs: JSON.stringify(layer.getLatLngs()[0].map(latLng => [latLng.lat, latLng.lng]))
      })
    }
  }

  const _onDeleted = e => {
    clearPreviousLayer()
  }

  const drawLayer = (layerType) => {
    if (layerType === 'circle') {
      const centerLatitude = form.getFieldValue("centerLatitude")
      const centerLongitude = form.getFieldValue("centerLongitude")
      const range = form.getFieldValue("range")

      featureGroupRef.current.addLayer(L.circle([centerLatitude, centerLongitude], {radius: range}));
      clearPreviousLayer()
    } else if (layerType === 'polygon') {
      const polygonLatLngs = form.getFieldValue("polygonLatLngs")

      featureGroupRef.current.addLayer(L.polygon(polygonLatLngs))
      clearPreviousLayer()
    }
  }

  return (
      <>
        <Form.Item label="Name" style={{marginBottom: "0px", marginTop: "0px"}}>
          {getFieldDecorator("name", {
            initialValue: label,
            rules: [
              {
                required: true,
                message: "Please input rule node name!",
                whitespace: true,
              },
            ],
          })(<Input/>)}
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="Latitude key" style={{marginBottom: "0px", marginTop: "0px"}}>
              {getFieldDecorator("latitudeKey", {
                initialValue: defaultConfig.latitudeKey,
                rules: [
                  {
                    required: true,
                    message: "Please input latitude key!",
                    whitespace: true,
                  },
                ],
              })(<Input/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Longitude key" style={{marginBottom: "0px", marginTop: "0px"}}>
              {getFieldDecorator("longitudeKey", {
                initialValue: defaultConfig.longitudeKey,
                rules: [
                  {
                    required: true,
                    message: "Please input longitude key!",
                    whitespace: true,
                  },
                ],
              })(<Input/>)}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Perimeter type" style={{marginBottom: "0px", marginTop: "0px"}}>
          {
            getFieldDecorator("perimeterType", {
              initialValue: defaultConfig.perimeter.perimeterType,
              rules: [
                {
                  required: true,
                  message: "Please input perimeter type!",
                },
              ]
            })(
                <Select onSelect={value => {
                  setPerimeterType(value)
                }}>
                  <Option value="CIRCLE">Circle</Option>
                  <Option value="POLYGON">Polygon</Option>
                </Select>
            )
          }
        </Form.Item>

        <div style={{height: "70vh"}}>
          <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={true}
                        attributionControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <DeviceMarkers markers={markers}/>
            <FeatureGroup ref={featureGroupRef}>
              {
                defaultConfig.perimeter.perimeterType === 'CIRCLE'
                    ? <Circle center={[defaultConfig.perimeter.centerLatitude, defaultConfig.perimeter.centerLongitude]}
                              radius={defaultConfig.perimeter.range}/>
                    : <Polygon positions={JSON.parse(defaultConfig.perimeter.polygonLatLngs)}/>
              }
              <EditControl position="topright"
                           onCreated={_onCreated}
                           onEdited={_onEdited}
                           onDeleted={_onDeleted}
                           draw={{
                             rectangle: false,
                             circle: {
                               showRadius: true,
                               metric: true, // Whether to use the metric measurement system or imperial
                               feet: true, // When not metric, use feet instead of yards for display
                               nautic: true // When not metric, not feet use nautic mile for display
                             },
                             polygon: {
                               showArea: true,
                               showLength: true,
                               metric: ['km', 'm'],
                               feet: true,
                               nautic: true
                             },
                             circlemarker: false,
                             polyline: false,
                           }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>

        {
          perimeterType === 'CIRCLE' ? <>
                <Row gutter={8} style={{marginBottom: "0px", marginTop: "0px"}}>
                  <Col span={12}>
                    <Form.Item style={{marginBottom: "0px", marginTop: "0px"}} label="Center latitude">
                      {getFieldDecorator("centerLatitude", {
                        initialValue: defaultConfig.perimeter.centerLatitude,
                        rules: [
                          {
                            required: true,
                            message: "Please input center latitude!",
                          },
                        ],
                      })(<Input onChange={(e) => {
                        form.setFieldsValue({
                          centerLatitude: e.target.value
                        })
                        drawLayer('circle')
                      }}/>)}
                    </Form.Item>
                  </Col>

                  <Col span={12}>

                    <Form.Item style={{marginBottom: "0px", marginTop: "0px"}} label="Center longitude">
                      {getFieldDecorator("centerLongitude", {
                        initialValue: defaultConfig.perimeter.centerLongitude,
                        rules: [
                          {
                            required: true,
                            message: "Please input center longitude!",
                          },
                        ],
                      })(<Input onChange={(e) => {
                        form.setFieldsValue({
                          centerLongitude: e.target.value
                        })
                        drawLayer('circle')
                      }}/>)}
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={8} style={{marginBottom: "0px", marginTop: "0px"}}>
                  <Col span={12}>
                    <Form.Item style={{marginBottom: "0px", marginTop: "0px"}} label="Range">
                      {getFieldDecorator("range", {
                        initialValue: defaultConfig.perimeter.range,
                        rules: [
                          {
                            required: true,
                            message: "Please input range!",
                          },
                        ],
                      })(<Input onChange={(e) => {
                        form.setFieldsValue({
                          range: e.target.value
                        })
                        drawLayer('circle')
                      }}/>)}
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item style={{marginBottom: "0px", marginTop: "0px"}} label="Range unit">
                      {
                        getFieldDecorator("rangeUnit", {
                          initialValue: defaultConfig.perimeter.rangeUnit,
                          rules: [
                            {
                              required: true,
                              message: "Please input range unit!",
                            },
                          ]
                        })(
                            <Select onChange={newRangeUnitValue => {
                              const rangeValue = form.getFieldValue("range")
                              const oldRangeUnitValue = form.getFieldValue("rangeUnit")
                              if (rangeValue) {
                                form.setFieldsValue({
                                      range: conversions(rangeValue, oldRangeUnitValue.toLowerCase(), newRangeUnitValue.toLowerCase())
                                    }
                                )
                              }
                            }}>
                              <Option value="METER">Meter</Option>
                              <Option value="KILOMETER">Kilometer</Option>
                              {/*<Option value="FOOT">Foot</Option>*/}
                              {/*<Option value="MILE">Mile</Option>*/}
                              {/*<Option value="NAUTICAL_MILE">Nautical mile</Option>*/}
                            </Select>
                        )
                      }
                    </Form.Item>
                  </Col>
                </Row>
              </>
              : perimeterType === 'POLYGON'
                  ? <>
                    <Form.Item label="Polygon definition"
                               help="Please, use the following format for manual definition of polygon: [[lat1,lon1],[lat2,lon2], ... ,[latN,lonN]]."
                               style={{marginBottom: "0px", marginTop: "0px"}}
                    >
                      {getFieldDecorator("polygonLatLngs", {
                        initialValue: defaultConfig.perimeter.polygonLatLngs,
                        rules: [
                          {
                            required: true,
                            message: "Please input polygon latitudes and longitudes!",
                          },
                        ],
                      })(<Input onChange={(e) => {
                        form.setFieldsValue({
                          polygonLatLngs: e.target.value
                        })
                        drawLayer('polygon')
                      }}/>)}
                    </Form.Item>
                  </>
                  : <></>
        }
      </>
  );
};

export default GeofencingFilterConfiguration

