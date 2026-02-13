#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: TestResult[] = [];

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  console.log('='.repeat(60));

  // Test 1: Check if DATABASE_URL is set
  console.log('\n📋 Test 1: Environment Variable Check');
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    results.push({
      name: 'Environment Variable',
      passed: false,
      message: 'DATABASE_URL is not set in .env file',
    });
    console.log('❌ FAILED: DATABASE_URL is not set');
  } else {
    results.push({
      name: 'Environment Variable',
      passed: true,
      message: 'DATABASE_URL is properly configured',
      details: databaseUrl.replace(/:[^:@]+@/, ':****@'), // Hide password
    });
    console.log('✅ PASSED: DATABASE_URL is set');
    console.log(`   URL: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);
  }

  // Test 2: Database Connection
  console.log('\n📋 Test 2: Database Connection');
  try {
    await prisma.$connect();
    results.push({
      name: 'Database Connection',
      passed: true,
      message: 'Successfully connected to database',
    });
    console.log('✅ PASSED: Connected to database');
  } catch (error) {
    results.push({
      name: 'Database Connection',
      passed: false,
      message: 'Failed to connect to database',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not connect to database');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 3: Execute Simple Query
  console.log('\n📋 Test 3: Execute Simple Query');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    results.push({
      name: 'Simple Query',
      passed: true,
      message: 'Successfully executed test query',
      details: result,
    });
    console.log('✅ PASSED: Query executed successfully');
  } catch (error) {
    results.push({
      name: 'Simple Query',
      passed: false,
      message: 'Failed to execute test query',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not execute query');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 4: Check Database Version
  console.log('\n📋 Test 4: Database Version Check');
  try {
    const versionResult = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    const version = versionResult[0]?.version || 'Unknown';
    results.push({
      name: 'Database Version',
      passed: true,
      message: 'Successfully retrieved database version',
      details: version,
    });
    console.log('✅ PASSED: Database version retrieved');
    console.log(`   Version: ${version}`);
  } catch (error) {
    results.push({
      name: 'Database Version',
      passed: false,
      message: 'Failed to retrieve database version',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not retrieve database version');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 5: Check if migrations are applied
  console.log('\n📋 Test 5: Migration Status Check');
  try {
    const migrations = await prisma.$queryRaw<
      Array<{ migration_name: string; finished_at: Date }>
    >`SELECT migration_name, finished_at FROM "_prisma_migrations" ORDER BY finished_at DESC`;

    if (migrations.length === 0) {
      results.push({
        name: 'Migration Status',
        passed: false,
        message: 'No migrations found - database may not be initialized',
      });
      console.log('⚠️  WARNING: No migrations found');
      console.log('   Run: yarn prisma:migrate');
    } else {
      results.push({
        name: 'Migration Status',
        passed: true,
        message: `Found ${migrations.length} migration(s)`,
        details: migrations.map((m) => ({
          name: m.migration_name,
          appliedAt: m.finished_at,
        })),
      });
      console.log(`✅ PASSED: Found ${migrations.length} migration(s)`);
      migrations.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.migration_name} (${m.finished_at})`);
      });
    }
  } catch (error) {
    results.push({
      name: 'Migration Status',
      passed: false,
      message: 'Failed to check migration status',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not check migrations');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 6: Check if Example table exists and is accessible
  console.log('\n📋 Test 6: Table Access Check');
  try {
    const count = await prisma.example.count();
    results.push({
      name: 'Table Access',
      passed: true,
      message: 'Successfully accessed Example table',
      details: { recordCount: count },
    });
    console.log('✅ PASSED: Example table is accessible');
    console.log(`   Records: ${count}`);
  } catch (error) {
    results.push({
      name: 'Table Access',
      passed: false,
      message: 'Failed to access Example table',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not access Example table');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Test 7: Test Write Operation
  console.log('\n📋 Test 7: Write Operation Test');
  try {
    const testRecord = await prisma.example.create({
      data: {
        name: `Test-${Date.now()}`,
      },
    });

    // Clean up test record
    await prisma.example.delete({
      where: { id: testRecord.id },
    });

    results.push({
      name: 'Write Operation',
      passed: true,
      message: 'Successfully created and deleted test record',
    });
    console.log('✅ PASSED: Write operations working');
  } catch (error) {
    results.push({
      name: 'Write Operation',
      passed: false,
      message: 'Failed to perform write operation',
      details: error instanceof Error ? error.message : String(error),
    });
    console.log('❌ FAILED: Could not perform write operation');
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Disconnect
  await prisma.$disconnect();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n⚠️  Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`   - ${r.name}: ${r.message}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  // Exit with appropriate code
  if (failed > 0) {
    console.log('\n❌ Database connection test FAILED\n');
    process.exit(1);
  } else {
    console.log('\n✅ All database connection tests PASSED\n');
    console.log('🎉 Your database is ready for team collaboration!\n');
    process.exit(0);
  }
}

// Run tests
testDatabaseConnection().catch((error) => {
  console.error('\n💥 Unexpected error during testing:', error);
  process.exit(1);
});
