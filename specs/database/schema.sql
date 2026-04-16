CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    surcharge_pct DECIMAL(5,2) DEFAULT 3.00,
    refund_surcharge BOOLEAN DEFAULT FALSE,
    auto_batch_time TIME DEFAULT '02:00',
    dms_config JSONB,
    demo_mode_enabled BOOLEAN DEFAULT TRUE,
    mid_mapping JSONB, -- { parts: 'MID1', service: 'MID2', body_shop: 'MID3' }
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uk_org_token UNIQUE (org_id, card_token)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID,
    ro_number VARCHAR(100),
    department_id VARCHAR(100),
    customer_token_id UUID REFERENCES customer_tokens(id) ON DELETE SET NULL,
    amount_base DECIMAL(12,2) NOT NULL,
    amount_surcharge DECIMAL(12,2) DEFAULT 0.00,
    amount_total DECIMAL(12,2) NOT NULL,
    amount_applied DECIMAL(12,2) DEFAULT 0.00,
    amount_remaining DECIMAL(12,2) DEFAULT 0.00,
    refund_amount DECIMAL(12,2) DEFAULT 0.00,
    line_items JSONB DEFAULT '[]'::jsonb,
    gateway_trans_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    is_settled BOOLEAN DEFAULT FALSE,
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

CREATE INDEX idx_txn_org_status ON transactions(org_id, status);
CREATE INDEX idx_txn_ro ON transactions(ro_number);
CREATE INDEX idx_txn_department ON transactions(department_id);
CREATE INDEX idx_txn_gateway ON transactions(gateway_trans_id);
CREATE INDEX idx_terminal_status ON terminal_heartbeats(status, last_heartbeat_at);
