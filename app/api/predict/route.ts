import { exec } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.comment;

    if (!text) {
      return NextResponse.json({ prediction: "ระบุข้อความ" }, { status: 400 });
    }

    const { stdout } = await execPromise(`python run_model.py "${text}"`);
    const result = stdout.trim();

    return NextResponse.json({ prediction: result });
  } catch (error) {
    return NextResponse.json({ prediction: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
