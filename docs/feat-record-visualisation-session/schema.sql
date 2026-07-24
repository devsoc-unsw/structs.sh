-- Proposed PostgreSQL schema for immutable, shareable preset-visualiser snapshots.
-- This is design documentation, not an applied migration.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE visualisation_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    schema_version smallint NOT NULL DEFAULT 1
        CHECK (schema_version > 0),
    renderer_version text NOT NULL
        CHECK (char_length(renderer_version) BETWEEN 1 AND 100),

    title text
        CHECK (title IS NULL OR char_length(title) BETWEEN 1 AND 120),
    structure_type text NOT NULL
        CHECK (structure_type IN (
            'linked-list',
            'binary-search-tree',
            'avl-tree',
            'sorting'
        )),
    structure_state jsonb NOT NULL
        CHECK (jsonb_typeof(structure_state) = 'object'),

    algorithm_name text,
    algorithm_arguments jsonb,
    algorithm_input_state jsonb,
    algorithm_state jsonb,
    playback_state jsonb,

    -- Opaque identifier from the application's auth boundary. It is optional
    -- for anonymous creation and is never returned by the public read API.
    owner_subject text,

    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    revoked_at timestamptz,

    CHECK (
        (algorithm_name IS NULL
            AND algorithm_arguments IS NULL
            AND algorithm_input_state IS NULL
            AND algorithm_state IS NULL
            AND playback_state IS NULL)
        OR
        (algorithm_name IS NOT NULL
            AND algorithm_arguments IS NOT NULL
            AND algorithm_input_state IS NOT NULL)
    ),
    CHECK (
        algorithm_arguments IS NULL
        OR jsonb_typeof(algorithm_arguments) = 'object'
    ),
    CHECK (
        algorithm_input_state IS NULL
        OR jsonb_typeof(algorithm_input_state) = 'object'
    ),
    CHECK (
        algorithm_state IS NULL
        OR jsonb_typeof(algorithm_state) = 'object'
    ),
    CHECK (
        playback_state IS NULL
        OR jsonb_typeof(playback_state) = 'object'
    ),
    CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Supports owner-facing listing without slowing down public reads.
CREATE INDEX visualisation_snapshots_owner_created_idx
    ON visualisation_snapshots (owner_subject, created_at DESC)
    WHERE owner_subject IS NOT NULL;

-- Supports scheduled cleanup of expired rows.
CREATE INDEX visualisation_snapshots_expires_idx
    ON visualisation_snapshots (expires_at)
    WHERE expires_at IS NOT NULL;

-- Public reads should use this shape so internal IDs and owner metadata cannot
-- be selected accidentally by the route.
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

COMMENT ON TABLE visualisation_snapshots IS
    'Immutable replay recipes for homepage preset visualisers; excludes debugger state.';
COMMENT ON COLUMN visualisation_snapshots.structure_state IS
    'Semantic structure state at capture time, using the versioned snapshot contract.';
COMMENT ON COLUMN visualisation_snapshots.algorithm_input_state IS
    'Semantic state immediately before the stored operation; used for deterministic replay.';
COMMENT ON COLUMN visualisation_snapshots.algorithm_state IS
    'Reserved for versioned algorithm-local variables or logical step data after the POC.';
COMMENT ON COLUMN visualisation_snapshots.playback_state IS
    'Reserved for normalised timeline progress and playback controls after the POC.';
