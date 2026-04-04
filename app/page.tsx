"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [newText, setNewText] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("abusive");
  const [saveStatus, setSaveStatus] = useState<string>("");

  const analyzeText = async () => {
    if (!text.trim()) return;
    const hasNonThai = /[^\u0E00-\u0E7F\s0-9.,!?]/.test(text); 
    const hasNoConsonant = !/[ก-ฮ]/.test(text);
    const isOnlyOneChar = text.trim().length === 1;
    if (hasNonThai || hasNoConsonant || isOnlyOneChar) {
      setResult("ERROR");
      return; 
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: text }),
      });
    const data = await res.json();
      setResult(data.prediction);
    } catch (error) {
      setResult("ERROR");
    }
    setLoading(false);
  };

  const saveNewData = async () => {
    if (!newText.trim()) return;
    setSaveStatus("กำลังบันทึก...");
    try {
      const res = await fetch("/api/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText, label: newLabel }),
      });
      if (res.ok) {
        setSaveStatus("บันทึกเสร็จสิ้น");
        setNewText("");
        setTimeout(() => setSaveStatus(""), 4000);
      } else {
        setSaveStatus("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      setSaveStatus("เชื่อมต่อไม่ได้");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-6 px-4 text-slate-900 flex flex-col items-center gap-6">
      {/* มือถือ */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {/* Header Section */}
        <div className="text-center py-4">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">Thai Shame Guard</h1>
          <p className="text-md text-slate-500 mt-1 font-medium">ตรวจจับข้อความไม่เหมาะสม</p>
        </div>
        {/* Card 1: วิเคราะห์ข้อความ */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <h2 className="font-bold text-slate-700">ตรวจสอบข้อความ</h2>
          </div>
          
          <textarea
            className="w-full p-4 bg-slate-50 border-none rounded-2xl mb-4 focus:ring-2 focus:ring-indigo-400 outline-none resize-none text-base transition-all"
            rows={4}
            placeholder="พิมพ์ข้อความที่ต้องการตรวจสอบ..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button
            onClick={analyzeText}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all ${
              loading ? "bg-slate-300" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "กำลังวิเคราะห์..." : "เริ่มการวิเคราะห์"}
          </button>

          {result && (
            <div className="mt-6 p-5 bg-indigo-50 rounded-[2rem] text-center border border-indigo-100 animate-bounce-short">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1"></p>
              <p className={`text-3xl font-black ${
                (result === 'ABUSIVE' || result === 'ERROR')? 'text-rose-500' : 
                result === 'CRITICISM' ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {result}
              </p>
            </div>
          )}
        </section>

        {/* Card 2: เพิ่มข้อมูล (Data Entry) */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-2 mb-4 ml-1">
            <h2 className="font-bold text-slate-700">เพิ่มคำใหม่</h2>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-400 outline-none"
              placeholder="กรอกคำใหม่..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
            
            <div className="flex flex-col gap-3">
              <div className="relative">
                <select
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none appearance-none font-medium text-slate-600 pr-10"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                >
                  <option value="abusive">ดูหมิ่น (Abusive)</option>
                  <option value="criticism">ด่า (Criticism)</option>
                  <option value="neutral">ทั่วไป (Neutral)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
              
              <button
                onClick={saveNewData}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
              >
                บันทึก
              </button>
            </div>

            {saveStatus && (
              <div className="mt-2 text-center py-2 px-4 bg-emerald-50 rounded-full">
                <p className="text-xs font-bold text-emerald-600">{saveStatus}</p>
              </div>
            )}
          </div>
        </section>

      </div>

      <footer className="mt-auto py-6 text-slate-400 text-[9px] font-bold tracking-[0.3em] uppercase">
        Project • Thai Shame Guard
      </footer>
    </main>
  );
}