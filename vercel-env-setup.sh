#!/bin/bash

# Vercel Environment Variables Setup Script
# This script sets up the environment variables for the production deployment

echo "Setting up Vercel environment variables..."

# Read current .env.local values (without quotes)
ADMIN_PASSWORD=$(grep "^ADMIN_PASSWORD=" .env.local | cut -d'=' -f2-)
SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d'=' -f2-)
SUPABASE_ANON_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2-)

echo "Environment variables to set in Vercel:"
echo "ADMIN_PASSWORD: ${ADMIN_PASSWORD}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY:0:20}..."

# Instructions for manual setup
echo ""
echo "🔧 Manual Vercel Setup Instructions:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your 'company-homepage' project"
echo "3. Go to Settings > Environment Variables"
echo "4. Set the following variables for Production:"
echo ""
echo "   ADMIN_PASSWORD = ${ADMIN_PASSWORD}"
echo "   NEXT_PUBLIC_SUPABASE_URL = ${SUPABASE_URL}"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY = ${SUPABASE_ANON_KEY}"
echo ""
echo "⚠️  Important: Do NOT include quotes around the values in Vercel"
echo "⚠️  The values above should be copied exactly as shown (without quotes)"
echo ""
echo "5. After setting all variables, redeploy the application"