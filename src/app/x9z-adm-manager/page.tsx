"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Lock, RefreshCw, BarChart3, LogOut, MessageCircle, LayoutTemplate } from "lucide-react";
import { loginAction, checkAdmin, deleteCommentAction, logoutAction } from "./actions";
import BannerManager from "./BannerManager";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initChecking, setInitChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<"comments" | "banners">("comments");

  useEffect(() => {
    checkAdmin().then((isAdmin) => {
      if (isAdmin) {
        setIsAuthenticated(true);
        fetchComments();
      }
      setInitChecking(false);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await loginAction(password);
    if (res.success) {
      setIsAuthenticated(true);
      fetchComments();
    } else {
      alert(res.error);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    setIsAuthenticated(false);
    setPassword("");
  };

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

  if (initChecking) return <div className="min-h-screen bg-slate-100" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg w-96 text-center border border-slate-200">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-6">관리자 접속</h1>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4 outline-none focus:border-indigo-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
            접속하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Lock size={28} className="text-indigo-600" />
            Admin Dashboard
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={fetchComments} 
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
              title="새로고침"
            >
              <RefreshCw size={20} className={loading ? "animate-spin text-indigo-500" : "text-slate-500"} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 hover:text-rose-500 shadow-sm transition-colors text-slate-500"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="text-slate-400 font-bold text-xs uppercase mb-2 tracking-wider">Total Comments</h3>
            <p className="text-5xl font-black text-slate-800">{comments.length}</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
             <div className="relative z-10">
                <h3 className="text-slate-400 font-bold text-xs uppercase mb-3 flex items-center gap-2 tracking-wider">
                   <BarChart3 size={16} /> Analytics Status
                </h3>
                <p className="text-2xl font-bold mb-6">Vercel Analytics Active</p>
                <a 
                  href="https://vercel.com/dashboard" 
                  target="_blank" 
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  접속자 통계 확인하기 →
                </a>
             </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === "comments" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <MessageCircle size={18} /> 댓글 관리
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
              activeTab === "banners" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <LayoutTemplate size={18} /> 배너/광고 관리
          </button>
        </div>

        {activeTab === "comments" ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                최근 작성된 댓글
                <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200">Live</span>
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
                  <p className="text-xs text-slate-400">여행자들의 참여를 기다려보세요!</p>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <BannerManager />
        )}
      </div>
    </div>
  );
}