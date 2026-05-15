const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ FATAL: Missing required environment variable: ${key}`);
    console.error(`📝 Please check your .env file and ensure ${key} is set`);
    process.exit(1);
  }
  return value;
};

// Validate all required environment variables at startup
function validateEnvironment(): void {
  const requiredVars = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_JWT_SECRET',
    'SQUAD_BASE_URL',
    'SQUAD_PUBLIC_KEY',
    'SQUAD_SECRET_KEY',
    'ENCRYPTION_KEY'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ FATAL: Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('📝 Please check your .env file');
    process.exit(1);
  }

  // Validate encryption key length
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
    console.error('❌ FATAL: ENCRYPTION_KEY must be at least 32 characters long');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
}

// Run validation immediately
validateEnvironment();

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
