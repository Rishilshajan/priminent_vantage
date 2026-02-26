export interface PasswordPolicy {
    min_password_length: number;
    password_expiration_days: number;
    require_special_symbols: boolean;
    require_numeric_digits: boolean;
    require_mixed_case: boolean;
}

/**
 * Utility for password generation and validation based on organizational policy.
 */
export const passwordPolicyUtils = {
    /**
     * Generates a random secure password that complies with the given policy.
     */
    generateSecurePassword(policy: PasswordPolicy): string {
        const length = Math.max(policy.min_password_length, 12);
        const charset = {
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        let chars = charset.lowercase;
        let password = '';

        // Ensure at least one character from each required category
        if (policy.require_mixed_case) {
            chars += charset.uppercase;
            password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
        }
        if (policy.require_numeric_digits) {
            chars += charset.numbers;
            password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
        }
        if (policy.require_special_symbols) {
            chars += charset.symbols;
            password += charset.symbols.charAt(Math.floor(Math.random() * charset.symbols.length));
        }

        // Always add a lowercase
        password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));

        // Fill the rest
        for (let i = password.length; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Shuffle
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    },

    /**
     * Validates a password against the given policy.
     * Returns an object with the result and an error message if invalid.
     */
    validatePassword(password: string, policy: PasswordPolicy): { isValid: boolean; error?: string } {
        if (password.length < policy.min_password_length) {
            return { isValid: false, error: `Password must be at least ${policy.min_password_length} characters long.` };
        }

        if (policy.require_numeric_digits && !/\d/.test(password)) {
            return { isValid: false, error: "Password must contain at least one numeric digit." };
        }

        if (policy.require_special_symbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
            return { isValid: false, error: "Password must contain at least one special symbol." };
        }

        if (policy.require_mixed_case) {
            if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
                return { isValid: false, error: "Password must contain both uppercase and lowercase letters." };
            }
        }

        return { isValid: true };
    }
};
