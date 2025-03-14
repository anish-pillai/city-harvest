# 5. Database Configuration

## Setting Up Your Production Database

1. Ensure your PostgreSQL database is accessible from Vercel:
   1. If using Neon, Supabase, or another cloud provider, check their documentation for serverless compatibility
   2. Consider connection pooling for better performance in serverless environments

2. Run migrations on your production database:
   1. Option 1: Use the Vercel CLI to run a one-time script:
   ```shellscript
   vercel run npm run db:migrate
   ```
   2. Option 2: Set up a deployment hook to run migrations during deployment

## Database Best Practices for Production

- Enable SSL for database connections
- Set up regular backups
- Monitor database performance
- Consider read replicas for high-traffic sites
