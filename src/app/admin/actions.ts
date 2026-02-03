"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// ... (기존 로그인, 로그아웃, 관리자 체크, 댓글 삭제 코드는 그대로 유지) ...

export async function loginAction(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "비밀번호가 틀렸습니다." };
}

export async function checkAdmin() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  return isAdmin;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

export async function deleteCommentAction(id: string) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: "관리자 권한이 없습니다." };

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("comments").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ▼▼▼ 여기부터 배너 관리 액션 추가 ▼▼▼

export async function getBannersAction() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return [];

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabaseAdmin
    .from("banners")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function createBannerAction(banner: { title: string; image_url: string; link_url: string }) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: "권한이 없습니다." };

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("banners").insert(banner);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleBannerAction(id: string, currentState: boolean) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: "권한이 없습니다." };

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from("banners")
    .update({ is_active: !currentState })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteBannerAction(id: string) {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return { success: false, error: "권한이 없습니다." };

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}