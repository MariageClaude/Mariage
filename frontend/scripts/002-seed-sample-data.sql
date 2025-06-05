-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role) VALUES 
('admin@wedding.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeH8H8H8H8H8H8H8H8H8H8H8H8H8H8H8', 'Wedding Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample guests
INSERT INTO guests (name, email, phone, address, city, country, guest_type, partner_name, number_of_guests, password, invitation_sent) VALUES 
('Jean Dupont', 'jean@example.com', '01 23 45 67 89', '123 Rue de la Paix', 'Paris', 'France', 'individual', NULL, 1, 'mariage2024', true),
('Marie Martin', 'marie@example.com', '01 98 76 54 32', '456 Avenue des Champs', 'Lyon', 'France', 'couple', 'Pierre Martin', 2, 'celebration123', false),
('Sophie Dubois', 'sophie@example.com', '01 11 22 33 44', '789 Boulevard Saint-Germain', 'Marseille', 'France', 'family', NULL, 4, 'amour456', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample ceremony responses
INSERT INTO ceremony_responses (guest_id, ceremony_type, response) VALUES 
(1, 'dot', 'attending'),
(1, 'civil', 'pending'),
(3, 'dot', 'attending'),
(3, 'civil', 'attending')
ON CONFLICT (guest_id, ceremony_type) DO NOTHING;

-- Insert sample invitation logs
INSERT INTO invitations_log (guest_id, email_status) VALUES 
(1, 'delivered'),
(3, 'delivered');
