"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MessageCircle, Send, User } from "lucide-react";

interface Comment {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
}

export default function CommentSection({ countryId }: { countryId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  // 댓글 불러오기
  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("country_id", countryId)
      .order("created_at", { ascending: false });
    
    if (data) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [countryId]);

  // 댓글 등록하기
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      country_id: countryId,
      nickname: nickname.trim() || "익명 여행자",
      content: content.trim(),
    });

    if (!error) {
      setContent("");
      fetchComments(); // 목록 새로고침
    }
    setLoading(false);
  };

  return (
    <div className="mt-10 pt-10 border-t border-slate-100">
      <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
        <MessageCircle size={20} className="text-indigo-500" />
        여행자 꿀팁 공유
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-200">
        <div className="flex gap-2 mb-3">
          <div className="relative w-1/3">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
              maxLength={10}
            />
          </div>
          <div className="flex-1 text-xs text-slate-400 flex items-center">
            * 욕설/비방은 삭제될 수 있습니다.
          </div>
        </div>
        <div className="relative">
          <textarea
            placeholder="이 도시에 대한 팁이나 궁금한 점을 남겨주세요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 pr-12 bg-white rounded-2xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none h-24"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl disabled:bg-slate-300 transition-colors hover:bg-indigo-700"
          >
            <Send size={16} />
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 text-xs">
                    {comment.nickname.charAt(0)}
                  </div>
                  {comment.nickname}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            첫 번째 꿀팁을 남겨주세요! 🎉
          </div>
        )}
      </div>
    </div>
  );
}