import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 로그인된 사용자는 에디터로 리다이렉트
  if (user) {
    redirect("/editor");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold">
          <span className="text-blue-600">My-Folio</span>에 오신 것을 환영합니다
        </h1>

        <p className="mt-3 text-xl sm:text-2xl text-gray-600">
          몇 분 만에 나만의 포트폴리오를 만들어보세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-colors"
          >
            회원가입
          </Link>
        </div>
      </main>
    </div>
  );
}
