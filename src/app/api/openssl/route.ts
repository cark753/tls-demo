// src/app/api/openssl/route.ts
import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get('host');
  if (!host) {
    return new Response('❌ 도메인을 입력하세요.', { status: 400 });
  }

  const cmd = `openssl s_client -connect ${host} -servername ${
    host.split(':')[0]
  } -brief`;

  try {
    const { stdout } = await execPromise(cmd);
    return new Response(stdout, { status: 200 });
  } catch (err: any) {
    return new Response(`❌ 오류: ${err.stderr || err.message}`, {
      status: 500,
    });
  }
}
