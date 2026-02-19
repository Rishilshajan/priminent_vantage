-- Add columns to simulations table for certificate signature and director title
ALTER TABLE simulations ADD COLUMN IF NOT EXISTS certificate_director_name TEXT;
ALTER TABLE simulations ADD COLUMN IF NOT EXISTS certificate_director_title TEXT;
ALTER TABLE simulations ADD COLUMN IF NOT EXISTS certificate_signature_url TEXT;

-- Update simulation_assets check constraint to include 'signature' asset type
ALTER TABLE simulation_assets DROP CONSTRAINT IF EXISTS simulation_assets_asset_type_check;
ALTER TABLE simulation_assets ADD CONSTRAINT simulation_assets_asset_type_check 
    CHECK (asset_type IN ('logo', 'banner', 'video', 'pdf', 'dataset', 'document', 'signature'));
