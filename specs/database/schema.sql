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

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    dms_customer_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    year INTEGER,
    make VARCHAR(100),
    model VARCHAR(100),
    vin VARCHAR(100),
    license_plate VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    dms_customer_id VARCHAR(100),
    card_token TEXT NOT NULL,
    last_four VARCHAR(4) NOT NULL,
    card_brand VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE repair_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES customer_vehicles(id) ON DELETE SET NULL,
    ro_number VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    amount_base DECIMAL(12,2) NOT NULL,
    amount_remaining DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE repair_order_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    repair_order_id UUID REFERENCES repair_orders(id) ON DELETE CASCADE,
    line_id VARCHAR(100),
    description TEXT NOT NULL,
    department_id VARCHAR(100),
    department_name VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(50)
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
