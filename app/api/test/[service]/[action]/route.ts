import { NextRequest, NextResponse } from 'next/server';
import { logTest } from '@/lib/db';
import { testNeonDB } from '@/lib/services/neondb';
import { testAWS } from '@/lib/services/aws';
import { testAzure } from '@/lib/services/azure';
import { testStripe } from '@/lib/services/stripe';
import { testMCP } from '@/lib/services/mcp';
import { testExternalAPI } from '@/lib/services/external';
import { testGit } from '@/lib/services/git';

export async function POST(
  request: NextRequest,
  { params }: { params: { service: string; action: string } }
) {
  const { service, action } = params;

  try {
    let result: { success: boolean; message: string; metadata?: any } = {
      success: false,
      message: 'Unknown service or action',
    };

    switch (service) {
      case 'neondb':
        result = await testNeonDB(action);
        break;
      case 'aws':
        result = await testAWS(action);
        break;
      case 'azure':
        result = await testAzure(action);
        break;
      case 'stripe':
        result = await testStripe(action);
        break;
      case 'mcp':
        result = await testMCP(action);
        break;
      case 'api':
        result = await testExternalAPI(action);
        break;
      case 'git':
        result = await testGit(action);
        break;
      default:
        result = { success: false, message: `Unknown service: ${service}` };
    }

    await logTest({
      service,
      action,
      status: result.success ? 'success' : 'error',
      message: result.message,
      metadata: result.metadata,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error occurred';
    await logTest({
      service,
      action,
      status: 'error',
      message: errorMessage,
      metadata: { error: error.toString() },
    });

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
