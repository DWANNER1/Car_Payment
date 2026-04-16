CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    surcharge_pct DECIMAL(5,2) DEFAULT 3.00,
    refund_surcharge BOOLEAN DEFAULT FALSE,
    auto_batch_time TIME DEFAULT '02:00',
    dms_config JSONB,
    demo_mode_enabled BOOLEAN DEFAULT TRUE,
    mid_mapping JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    dms_customer_id VARCHAR(100),
    card_token TEXT NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    card_brand VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    ro_number VARCHAR(100),
    department_id VARCHAR(100),
    amount_base DECIMAL(12,2) NOT NULL,
    amount_surcharge DECIMAL(12,2) DEFAULT 0.00,
    amount_total DECIMAL(12,2) NOT NULL,
    amount_applied DECIMAL(12,2) DEFAULT 0.00,
    amount_remaining DECIMAL(12,2) DEFAULT 0.00,
    refund_amount DECIMAL(12,2) DEFAULT 0.00,
    line_items JSONB DEFAULT '[]'::jsonb,
    gateway_trans_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    dms_posted BOOLEAN DEFAULT FALSE,
    dms_sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE terminal_heartbeats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    terminal_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    last_heartbeat_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);
