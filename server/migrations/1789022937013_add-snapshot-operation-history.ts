import type { MigrationBuilder } from 'node-pg-migrate';

// Run using node-pg-migrate's default transaction; do not disable transactions.
export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    LOCK TABLE visualisation_snapshots IN ACCESS EXCLUSIVE MODE;

    -- Reserved state cannot be represented by the new history contract.
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM visualisation_snapshots
        WHERE algorithm_state IS NOT NULL OR playback_state IS NOT NULL
      ) THEN
        RAISE EXCEPTION 'Cannot migrate snapshots containing algorithm or playback state';
      END IF;
    END $$;

    ALTER TABLE visualisation_snapshots
      ADD COLUMN operation_history jsonb;

    UPDATE visualisation_snapshots
    SET operation_history = CASE
      WHEN algorithm_name IS NULL THEN
        jsonb_build_object(
          'initialState', structure_state,
          'operations', '[]'::jsonb
        )
      ELSE
        jsonb_build_object(
          'initialState', algorithm_input_state,
          'operations', jsonb_build_array(
            jsonb_build_object(
              'name', algorithm_name,
              'arguments', algorithm_arguments
            )
          )
        )
    END;

    -- IS TRUE rejects missing JSON keys: SQL CHECK otherwise permits NULL.
    -- CASE prevents array functions from being called on non-array JSON.
    ALTER TABLE visualisation_snapshots
      ALTER COLUMN operation_history SET NOT NULL,
      ADD CONSTRAINT visualisation_snapshots_history_shape_check CHECK (
        (
          jsonb_typeof(operation_history) = 'object'
          AND jsonb_typeof(operation_history -> 'initialState') = 'object'
          AND jsonb_typeof(operation_history -> 'initialState' -> 'values') = 'array'
          AND jsonb_typeof(operation_history -> 'operations') = 'array'
          AND operation_history - 'initialState' - 'operations' = '{}'::jsonb
        ) IS TRUE
      ),
      ADD CONSTRAINT visualisation_snapshots_history_length_check CHECK (
        CASE
          WHEN jsonb_typeof(operation_history -> 'operations') = 'array'
          THEN jsonb_array_length(operation_history -> 'operations') <= 150
          ELSE FALSE
        END
      );

    -- The old view depends on columns being removed, so recreate it.
    DROP VIEW public_visualisation_snapshots;

    -- PostgreSQL also removes table CHECK constraints referencing these columns.
    ALTER TABLE visualisation_snapshots
      DROP COLUMN algorithm_name,
      DROP COLUMN algorithm_arguments,
      DROP COLUMN algorithm_input_state,
      DROP COLUMN algorithm_state,
      DROP COLUMN playback_state;

    CREATE VIEW public_visualisation_snapshots AS
    SELECT
      share_id,
      schema_version,
      renderer_version,
      title,
      structure_type,
      structure_state,
      operation_history,
      created_at,
      expires_at
    FROM visualisation_snapshots
    WHERE revoked_at IS NULL
      AND (expires_at IS NULL OR expires_at > now());

    COMMENT ON COLUMN visualisation_snapshots.operation_history IS
      'Initial semantic state and up to 150 ordered operations; detailed validation and replay consistency are enforced by the API.';
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    LOCK TABLE visualisation_snapshots IN ACCESS EXCLUSIVE MODE;

    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM visualisation_snapshots
        WHERE jsonb_array_length(operation_history -> 'operations') > 1
      ) THEN
        RAISE EXCEPTION 'Cannot roll back: multi-operation histories would lose data';
      END IF;

      IF EXISTS (
        SELECT 1 FROM visualisation_snapshots
        WHERE jsonb_array_length(operation_history -> 'operations') = 0
          AND operation_history -> 'initialState' IS DISTINCT FROM structure_state
      ) THEN
        RAISE EXCEPTION 'Cannot roll back: static initial and final states differ';
      END IF;
    END $$;

    ALTER TABLE visualisation_snapshots
      ADD COLUMN algorithm_name text,
      ADD COLUMN algorithm_arguments jsonb,
      ADD COLUMN algorithm_input_state jsonb,
      ADD COLUMN algorithm_state jsonb,
      ADD COLUMN playback_state jsonb;

    UPDATE visualisation_snapshots
    SET
      algorithm_name = operation_history -> 'operations' -> 0 ->> 'name',
      algorithm_arguments = operation_history -> 'operations' -> 0 -> 'arguments',
      algorithm_input_state = operation_history -> 'initialState'
    WHERE jsonb_array_length(operation_history -> 'operations') = 1;

    ALTER TABLE visualisation_snapshots
      ADD CONSTRAINT visualisation_snapshots_algorithm_presence_check CHECK (
        (
          algorithm_name IS NULL
          AND algorithm_arguments IS NULL
          AND algorithm_input_state IS NULL
          AND algorithm_state IS NULL
          AND playback_state IS NULL
        )
        OR (
          algorithm_name IS NOT NULL
          AND algorithm_arguments IS NOT NULL
          AND algorithm_input_state IS NOT NULL
        )
      ),
      ADD CONSTRAINT visualisation_snapshots_algorithm_arguments_check CHECK (
        algorithm_arguments IS NULL OR jsonb_typeof(algorithm_arguments) = 'object'
      ),
      ADD CONSTRAINT visualisation_snapshots_algorithm_input_check CHECK (
        algorithm_input_state IS NULL OR jsonb_typeof(algorithm_input_state) = 'object'
      ),
      ADD CONSTRAINT visualisation_snapshots_algorithm_state_check CHECK (
        algorithm_state IS NULL OR jsonb_typeof(algorithm_state) = 'object'
      ),
      ADD CONSTRAINT visualisation_snapshots_playback_state_check CHECK (
        playback_state IS NULL OR jsonb_typeof(playback_state) = 'object'
      );

    DROP VIEW public_visualisation_snapshots;

    ALTER TABLE visualisation_snapshots DROP COLUMN operation_history;

    CREATE VIEW public_visualisation_snapshots AS
    SELECT
      share_id,
      schema_version,
      renderer_version,
      title,
      structure_type,
      structure_state,
      algorithm_name,
      algorithm_arguments,
      algorithm_input_state,
      algorithm_state,
      playback_state,
      created_at,
      expires_at
    FROM visualisation_snapshots
    WHERE revoked_at IS NULL
      AND (expires_at IS NULL OR expires_at > now());

    COMMENT ON COLUMN visualisation_snapshots.algorithm_input_state IS
      'Semantic state immediately before the stored operation; used for deterministic replay.';
    COMMENT ON COLUMN visualisation_snapshots.algorithm_state IS
      'Reserved for algorithm-local variables or logical step data after the POC.';
    COMMENT ON COLUMN visualisation_snapshots.playback_state IS
      'Reserved for timeline progress and playback controls after the POC.';
  `);
}
