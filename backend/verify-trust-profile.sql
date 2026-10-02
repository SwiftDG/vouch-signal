-- Read-only verification for the Trust Profile schema.
-- Run this in Supabase SQL Editor; every check should report PASS.

WITH expected_columns(table_name, column_name, data_type, udt_name, is_nullable) AS (
    VALUES
        ('BusinessProfile', 'id', 'text', 'text', 'NO'),
        ('BusinessProfile', 'supabaseUserId', 'text', 'text', 'NO'),
        ('BusinessProfile', 'publicSlug', 'text', 'text', 'NO'),
        ('BusinessProfile', 'businessName', 'text', 'text', 'NO'),
        ('BusinessProfile', 'businessType', 'USER-DEFINED', 'BusinessType', 'NO'),
        ('BusinessProfile', 'category', 'text', 'text', 'YES'),
        ('BusinessProfile', 'bio', 'text', 'text', 'YES'),
        ('BusinessProfile', 'location', 'text', 'text', 'YES'),
        ('BusinessProfile', 'contactUrl', 'text', 'text', 'YES'),
        ('BusinessProfile', 'createdAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('BusinessProfile', 'updatedAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('Evidence', 'id', 'text', 'text', 'NO'),
        ('Evidence', 'businessProfileId', 'text', 'text', 'NO'),
        ('Evidence', 'title', 'text', 'text', 'NO'),
        ('Evidence', 'description', 'text', 'text', 'YES'),
        ('Evidence', 'evidenceType', 'USER-DEFINED', 'EvidenceType', 'NO'),
        ('Evidence', 'completedDate', 'timestamp without time zone', 'timestamp', 'NO'),
        ('Evidence', 'customerName', 'text', 'text', 'YES'),
        ('Evidence', 'verificationStatus', 'USER-DEFINED', 'VerificationStatus', 'NO'),
        ('Evidence', 'createdAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('Evidence', 'updatedAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('ConfirmationRequest', 'id', 'text', 'text', 'NO'),
        ('ConfirmationRequest', 'evidenceId', 'text', 'text', 'NO'),
        ('ConfirmationRequest', 'token', 'text', 'text', 'NO'),
        ('ConfirmationRequest', 'state', 'USER-DEFINED', 'ConfirmationState', 'NO'),
        ('ConfirmationRequest', 'expiresAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('ConfirmationRequest', 'confirmerName', 'text', 'text', 'YES'),
        ('ConfirmationRequest', 'confirmedAt', 'timestamp without time zone', 'timestamp', 'YES'),
        ('ConfirmationRequest', 'createdAt', 'timestamp without time zone', 'timestamp', 'NO'),
        ('ConfirmationRequest', 'updatedAt', 'timestamp without time zone', 'timestamp', 'NO')
), checks(check_name, passed, details) AS (
    SELECT
        'table exists: ' || expected.table_name,
        to_regclass(format('public.%I', expected.table_name)) IS NOT NULL,
        'Expected public.' || expected.table_name
    FROM (VALUES ('BusinessProfile'), ('Evidence'), ('ConfirmationRequest')) AS expected(table_name)

    UNION ALL

    SELECT
        'column: ' || expected.table_name || '.' || expected.column_name,
        actual.column_name IS NOT NULL
            AND actual.data_type = expected.data_type
            AND actual.udt_name = expected.udt_name
            AND actual.is_nullable = expected.is_nullable,
        'Expected ' || expected.data_type || '/' || expected.udt_name
            || ', nullable=' || expected.is_nullable
            || '; found ' || COALESCE(actual.data_type || '/' || actual.udt_name, 'MISSING')
            || ', nullable=' || COALESCE(actual.is_nullable, 'UNKNOWN')
    FROM expected_columns AS expected
    LEFT JOIN information_schema.columns AS actual
        ON actual.table_schema = 'public'
        AND actual.table_name = expected.table_name
        AND actual.column_name = expected.column_name

    UNION ALL

    SELECT
        'primary key: ' || expected.table_name || '.id',
        EXISTS (
            SELECT 1
            FROM pg_constraint AS constraint_row
            JOIN pg_class AS table_row ON table_row.oid = constraint_row.conrelid
            JOIN pg_namespace AS schema_row ON schema_row.oid = table_row.relnamespace
            JOIN pg_attribute AS column_row
                ON column_row.attrelid = table_row.oid
                AND column_row.attname = 'id'
            WHERE schema_row.nspname = 'public'
                AND table_row.relname = expected.table_name
                AND constraint_row.contype = 'p'
                AND constraint_row.conkey = ARRAY[column_row.attnum]::smallint[]
        ),
        'Expected id as the sole primary-key column'
    FROM (VALUES ('BusinessProfile'), ('Evidence'), ('ConfirmationRequest')) AS expected(table_name)

    UNION ALL

    SELECT
        'unique index: ' || expected.table_name || '.' || expected.column_name,
        EXISTS (
            SELECT 1
            FROM pg_index AS index_row
            JOIN pg_class AS table_row ON table_row.oid = index_row.indrelid
            JOIN pg_namespace AS schema_row ON schema_row.oid = table_row.relnamespace
            JOIN pg_attribute AS column_row
                ON column_row.attrelid = table_row.oid
                AND column_row.attname = expected.column_name
            WHERE schema_row.nspname = 'public'
                AND table_row.relname = expected.table_name
                AND index_row.indisunique
                AND index_row.indpred IS NULL
                AND index_row.indnkeyatts = 1
                AND index_row.indkey::text = column_row.attnum::text
        ),
        'Expected a unique index on this column'
    FROM (VALUES
        ('BusinessProfile', 'supabaseUserId'),
        ('BusinessProfile', 'publicSlug'),
        ('ConfirmationRequest', 'evidenceId'),
        ('ConfirmationRequest', 'token')
    ) AS expected(table_name, column_name)

    UNION ALL

    SELECT
        'foreign key: ' || expected.source_table || '.' || expected.source_column,
        EXISTS (
            SELECT 1
            FROM pg_constraint AS constraint_row
            JOIN pg_class AS source_table ON source_table.oid = constraint_row.conrelid
            JOIN pg_namespace AS source_schema ON source_schema.oid = source_table.relnamespace
            JOIN pg_class AS target_table ON target_table.oid = constraint_row.confrelid
            JOIN pg_namespace AS target_schema ON target_schema.oid = target_table.relnamespace
            JOIN pg_attribute AS source_column
                ON source_column.attrelid = source_table.oid
                AND source_column.attname = expected.source_column
            JOIN pg_attribute AS target_column
                ON target_column.attrelid = target_table.oid
                AND target_column.attname = expected.target_column
            WHERE constraint_row.contype = 'f'
                AND source_schema.nspname = 'public'
                AND source_table.relname = expected.source_table
                AND constraint_row.conkey = ARRAY[source_column.attnum]::smallint[]
                AND target_schema.nspname = 'public'
                AND target_table.relname = expected.target_table
                AND constraint_row.confkey = ARRAY[target_column.attnum]::smallint[]
                AND constraint_row.confdeltype = 'r'
                AND constraint_row.confupdtype = 'c'
        ),
        'Expected reference to public.' || expected.target_table || '.' || expected.target_column
            || ' with ON DELETE RESTRICT ON UPDATE CASCADE'
    FROM (VALUES
        ('Evidence', 'businessProfileId', 'BusinessProfile', 'id'),
        ('ConfirmationRequest', 'evidenceId', 'Evidence', 'id')
    ) AS expected(source_table, source_column, target_table, target_column)

    UNION ALL

    SELECT
        'enum values: ' || expected.enum_name,
        COALESCE((
            SELECT array_agg(enum_row.enumlabel::text ORDER BY enum_row.enumsortorder)
            FROM pg_type AS type_row
            JOIN pg_enum AS enum_row ON enum_row.enumtypid = type_row.oid
            JOIN pg_namespace AS schema_row ON schema_row.oid = type_row.typnamespace
            WHERE schema_row.nspname = 'public'
                AND type_row.typname = expected.enum_name
        ), ARRAY[]::text[]) = expected.enum_values,
        'Expected ' || expected.enum_values::text
    FROM (VALUES
        ('BusinessType', ARRAY['VENDOR', 'FREELANCER']::text[]),
        ('EvidenceType', ARRAY['ORDER', 'PROJECT', 'DELIVERY', 'SERVICE', 'OTHER']::text[]),
        ('VerificationStatus', ARRAY['SELF_REPORTED', 'CUSTOMER_CONFIRMED']::text[]),
        ('ConfirmationState', ARRAY['PENDING', 'CONFIRMED', 'EXPIRED']::text[])
    ) AS expected(enum_name, enum_values)

    UNION ALL

    SELECT
        'default: ' || expected.table_name || '.' || expected.column_name,
        actual.column_default = expected.default_expression,
        'Expected ' || expected.default_expression
            || '; found ' || COALESCE(actual.column_default, 'MISSING')
    FROM (VALUES
        ('BusinessProfile', 'createdAt', 'CURRENT_TIMESTAMP'),
        ('Evidence', 'createdAt', 'CURRENT_TIMESTAMP'),
        ('ConfirmationRequest', 'createdAt', 'CURRENT_TIMESTAMP'),
        ('Evidence', 'verificationStatus', '''SELF_REPORTED''::"VerificationStatus"'),
        ('ConfirmationRequest', 'state', '''PENDING''::"ConfirmationState"')
    ) AS expected(table_name, column_name, default_expression)
    LEFT JOIN information_schema.columns AS actual
        ON actual.table_schema = 'public'
        AND actual.table_name = expected.table_name
        AND actual.column_name = expected.column_name
)
SELECT
    check_name,
    CASE WHEN passed THEN 'PASS' ELSE 'FAIL' END AS status,
    details
FROM checks

UNION ALL

SELECT
    'OVERALL',
    CASE WHEN bool_and(passed) THEN 'PASS' ELSE 'FAIL' END,
    count(*) FILTER (WHERE NOT passed)::text || ' failed of ' || count(*)::text || ' checks'
FROM checks
ORDER BY check_name;
