const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ FATAL: Missing required environment variable: ${key}`);
    console.error(`📝 Please check your .env file and ensure ${key} is set`);
    process.exit(1);
  }
  return value;
};

export const config = {
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  databaseUrl: required('DATABASE_URL'),
  supabaseUrl: required('SUPABASE_URL'),
};
