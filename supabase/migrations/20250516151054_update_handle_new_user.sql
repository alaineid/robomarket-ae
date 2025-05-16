-- Modify handle_new_user function to update existing guest customer records
-- Migration timestamp: 20250516151054

-- Update function to check for existing guest customer with the same email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    existing_guest_id UUID;
BEGIN
    -- Check if there's an existing guest customer with the same email
    SELECT id INTO existing_guest_id
    FROM public.customers
    WHERE email = NEW.email AND is_guest = TRUE
    LIMIT 1;
    
    IF existing_guest_id IS NOT NULL THEN
        -- Update the existing guest customer with auth_user_id
        UPDATE public.customers
        SET 
            auth_user_id = NEW.id,
            is_guest = FALSE,
            first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
            last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
            updated_at = NOW()
        WHERE id = existing_guest_id;
    ELSE
        -- Insert a new customer record as before
        INSERT INTO public.customers (auth_user_id, email, first_name, last_name, is_guest)
        VALUES (
            NEW.id, 
            NEW.email, 
            NEW.raw_user_meta_data->>'first_name',
            NEW.raw_user_meta_data->>'last_name',
            FALSE
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;