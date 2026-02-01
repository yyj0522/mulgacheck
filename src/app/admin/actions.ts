"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// 1. 관리자 로그인 (쿠키 생성)
export async function loginAction(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    // 비밀번호가 맞으면 'admin_session'이라는 인증 도장(쿠키)을 찍어줍니다.
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true, // 자바스크립트로 접근 불가 (해킹 방지)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24시간 유지
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "비밀번호가 틀렸습니다." };
}

// 2. 관리자 권한 확인
export async function checkAdmin() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  return isAdmin;
}

// 3. 댓글 삭제 (관리자 권한 키 사용)
export async function deleteCommentAction(id: string) {
  // 먼저 관리자인지 확인
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return { success: false, error: "관리자 권한이 없습니다." };
  }

  // 관리자 전용 클라이언트 생성 (Service Role Key 사용)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("comments").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// 4. 로그아웃
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}