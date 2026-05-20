export type UserRole = 'super_admin' | 'admin' | 'warehouse' | 'finance' | 'reseller';

export type UserStatus = 'active' | 'inactive';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
};

export type Auth = {
    user: User | null;
};
