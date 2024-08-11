'use client'
import Image from "next/image";
import InputForm from "@/components/search_form";
export default function Home() {
  return (
    <main className="flex items-center flex-col">
      <h1 className="text-4xl font-mono">Toan's Netflix Guide</h1>
      <h3 className="text-xl mb-20" style={{ color: '#718096' }}>semantically search a database of over 4000 genres and categories</h3>
      <div className="flex items-center font-mono text-sm lg:flex">
       <InputForm/>
      </div>
    </main>
  );
}
