// src/pages/public/Home.jsx
import HeaderStudents from "@/components/public/Header";
 import HeroStudents from "@/components/public/Hero";

// Cambiamos `export default` por `export function Home`
export default function Home() {
  return (
    <div>
      <HeaderStudents />
      <HeroStudents />
    </div>
  );
}