/*
  # Add delivery_location column to landing_settings table
  
  1. New Columns
     - `delivery_location` (text, default 'Bangalore 560001')
     
  2. Changes
     - Adds a new column to store the default delivery location shown in the top banner
*/

-- Add delivery_location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'landing_settings' AND column_name = 'delivery_location'
  ) THEN
    ALTER TABLE landing_settings ADD COLUMN delivery_location text DEFAULT 'Bangalore 560001';
  END IF;
END $$;