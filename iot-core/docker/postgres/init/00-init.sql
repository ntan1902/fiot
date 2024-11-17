-- Create the fiot database
CRATE DATABASE fiot;

-- Connect to the fiot database
\c fiot;

-- Enable TimescaleDB extension
CREATE
EXTENSION IF NOT EXISTS timescaledb;

-- Note: This assumes the ts_kv table already exists
-- If the table doesn't exist, you need to create it first
-- Example (adjust columns as needed):
/*
CREATE TABLE IF NOT EXISTS ts_kv (
    entity_id uuid NOT NULL,
    key varchar(255) NOT NULL,
    ts bigint NOT NULL,
    value json,
    -- Add other columns as needed
);
*/

-- Create hypertable
SELECT create_hypertable(
               'ts_kv', -- table name
               'ts', -- time column name
               migrate_data = > true,
               if_not_exists = > true,
               chunk_time_interval = > 86400000
       );