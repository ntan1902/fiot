import { dropRight } from 'lodash'
import {
  LOAD_LATEST_TELEMETRIES,
  LOAD_TELEMETRIES,
  UPDATE_TELEMETRIES,
} from '../actions/types'

const initialState = {
  telemetries: {},
  latestTelemetries: {},
}

export default function (state = initialState, action) {
  const { type, payload } = action

  let newTelemetry = {}
  let newLatestTelemetry = {}
  switch (type) {
    case LOAD_TELEMETRIES:
      newTelemetry[payload.entityId] = payload.kvs
      return {
        ...state,
        telemetries: {
          ...state.telemetries,
          ...newTelemetry,
        },
      }

    case UPDATE_TELEMETRIES:
      if (
        payload.entityId in state.telemetries &&
        payload.entityId in state.latestTelemetries
      ) {
        newTelemetry = {}
        newTelemetry[payload.entityId] = [
          ...payload.kvs,
          ...dropRight(state.telemetries[payload.entityId], payload.kvs.length),
        ]

        newLatestTelemetry = {}
        newLatestTelemetry[payload.entityId] = [
          ...payload.kvs,
          ...state.latestTelemetries[payload.entityId],
        ]

        return {
          ...state,
          telemetries: {
            ...state.telemetries,
            ...newTelemetry,
          },
          latestTelemetries: {
            ...state.latestTelemetries,
            ...newLatestTelemetry,
          },
        }
      }
      return {
        ...state,
      }

    case LOAD_LATEST_TELEMETRIES:
      newLatestTelemetry[payload.entityId] = payload.kvs
      return {
        ...state,
        latestTelemetries: {
          ...state.latestTelemetries,
          ...newLatestTelemetry,
        },
      }

    default:
      return state
  }
}
