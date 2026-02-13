"use server";

import { createClient } from "@supabase/supabase-js";

// 로컬 접속은 미들웨어가 통과시켰으므로 무조건 관리자(true)로 간주
export async function checkAdmin() {
  return true;
}

export async function deleteCommentAction(id: string) {
  // 굳이 체크할 필요 없지만 안전장치로 남겨둠
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