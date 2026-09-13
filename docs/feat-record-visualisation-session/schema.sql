-- Resulting schema after both snapshot migrations; documentation only.
-- Apply server/migrations with node-pg-migrate, not this file to an existing DB.

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

    operation_history jsonb NOT NULL,

    -- Opaque identifier from the application's auth boundary. It is optional
    -- for anonymous creation and is never returned by the public read API.
    owner_subject text,

    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    revoked_at timestamptz,

    CONSTRAINT visualisation_snapshots_history_shape_check CHECK (
        (
            jsonb_typeof(operation_history) = 'object'
            AND jsonb_typeof(operation_history -> 'initialState') = 'object'
            AND jsonb_typeof(operation_history -> 'initialState' -> 'values') = 'array'
            AND jsonb_typeof(operation_history -> 'operations') = 'array'
            AND operation_history - 'initialState' - 'operations' = '{}'::jsonb
        ) IS TRUE
    ),
    CONSTRAINT visualisation_snapshots_history_length_check CHECK (
        CASE WHEN jsonb_typeof(operation_history -> 'operations') = 'array'
            THEN jsonb_array_length(operation_history -> 'operations') <= 150
            ELSE FALSE
        END
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
    operation_history,
    created_at,
    expires_at
FROM visualisation_snapshots
WHERE revoked_at IS NULL
  AND (expires_at IS NULL OR expires_at > now());

COMMENT ON TABLE visualisation_snapshots IS
    'Immutable replay recipes for homepage preset visualisers; excludes debugger state.';
COMMENT ON COLUMN visualisation_snapshots.structure_state IS
    'Semantic structure state at capture time, using the versioned snapshot contract.';
COMMENT ON COLUMN visualisation_snapshots.operation_history IS
    'Initial semantic state and up to 150 ordered operations; detailed validation and replay consistency are enforced by the API.';
