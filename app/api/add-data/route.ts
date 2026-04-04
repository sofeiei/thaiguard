import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

// ผมทำการแปลง exec ให้รองรับการทำงานแบบรอคิว (async/await)
const execPromise = util.promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, label } = body;

    if (!text || !label) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data.json');
    
    //อ่านข้อมูลเดิม
    let existingData: { text: string; label: string }[] = [];
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      existingData = []; 
    }

    //เพิ่มข้อมูลใหม่และเซฟลงไฟล์
    existingData.push({ text: text, label: label });
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');

    // สั่งเทรน AI อัตโนมัติ (เพิ่มเข้ามาใหม่!)
    console.log("กำลังอัปเดต...");
    await execPromise('python train.py');
    console.log("อัปเดตสำเร็จ!");

    return NextResponse.json({ message: "อัปเดตสำเร็จ!" }, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}