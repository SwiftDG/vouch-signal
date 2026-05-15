const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const config = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  databaseUrl: required('DATABASE_URL'),
  supabaseUrl: required('SUPABASE_URL'),
  supabaseAnonKey: required('SUPABASE_ANON_KEY'),
  supabaseJwtSecret: required('SUPABASE_JWT_SECRET'),
  squadBaseUrl: required('SQUAD_BASE_URL'),
  squadPublicKey: required('SQUAD_PUBLIC_KEY'),
  squadSecretKey: required('SQUAD_SECRET_KEY'),
  encryptionKey: required('ENCRYPTION_KEY'),
  partnerApiKeys: (process.env['PARTNER_API_KEYS'] || '').split(',').filter(Boolean),
};
