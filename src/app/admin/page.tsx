"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, RefreshCw, MessageCircle } from "lucide-react";
import { deleteCommentAction } from "./actions";

export default function AdminPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, countries(name_ko)")
      .order("created_at", { ascending: false });

    if (data) setComments(data);
    if (error) console.error(error);
    setLoading(false);
  };

  const deleteComment = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await deleteCommentAction(id);
    if (res.success) {
      alert("삭제되었습니다.");
      fetchComments();
    } else {
      alert("삭제 실패: " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <MessageCircle size={28} className="text-indigo-600" />
            Comments Manager
          </h1>
          <button 
            onClick={fetchComments} 
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
            title="새로고침"
          >
            <RefreshCw size={20} className={loading ? "animate-spin text-indigo-500" : "text-slate-500"} />
          </button>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              전체 댓글 목록
              <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200">
                Total {comments.length}
              </span>
            </h2>
          </div>
          
          <ul className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <li key={comment.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-indigo-100">
                      {comment.countries?.name_ko || 'Deleted Country'}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">{comment.nickname}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                </div>
                <button 
                  onClick={() => deleteComment(comment.id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="영구 삭제"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
            {comments.length === 0 && (
              <li className="p-20 text-center">
                <p className="text-slate-300 font-bold mb-2">작성된 댓글이 없습니다.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}