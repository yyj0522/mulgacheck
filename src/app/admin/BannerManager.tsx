"use client";

import { useState, useEffect } from "react";
import { getBannersAction, createBannerAction, toggleBannerAction, deleteBannerAction } from "./actions";
import { Plus, Trash2, ExternalLink, Image as ImageIcon, ToggleLeft, ToggleRight } from "lucide-react";

export default function BannerManager() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newBanner, setNewBanner] = useState({
    title: "",
    image_url: "",
    link_url: "",
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const data = await getBannersAction();
    setBanners(data);
  };

  const handleCreate = async () => {
    if (!newBanner.title || !newBanner.link_url) {
      alert("배너 이름과 이동할 링크는 필수입니다.");
      return;
    }
    setLoading(true);
    const res = await createBannerAction(newBanner);
    if (res.success) {
      alert("배너가 등록되었습니다.");
      setNewBanner({ title: "", image_url: "", link_url: "" });
      loadBanners();
    } else {
      alert("등록 실패: " + res.error);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    await toggleBannerAction(id, currentState);
    loadBanners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 배너를 삭제하시겠습니까?")) return;
    await deleteBannerAction(id);
    loadBanners();
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden p-6">
      <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
        <ImageIcon size={20} className="text-indigo-500" />
        배너/광고 관리
      </h2>

      <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
        <h3 className="font-bold text-sm text-slate-500 mb-4 uppercase">새 배너 등록</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="배너 이름 (관리용)"
            className="p-3 border rounded-xl"
            value={newBanner.title}
            onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="이미지 URL (선택사항)"
            className="p-3 border rounded-xl"
            value={newBanner.image_url}
            onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })}
          />
          <input
            type="text"
            placeholder="이동할 링크 URL (필수)"
            className="p-3 border rounded-xl"
            value={newBanner.link_url}
            onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })}
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> 배너 등록하기
        </button>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800">{banner.title}</p>
                <a href={banner.link_url} target="_blank" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                  {banner.link_url} <ExternalLink size={10} />
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(banner.id, banner.is_active)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  banner.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                {banner.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                {banner.is_active ? "노출 중" : "숨김"}
              </button>
              <button
                onClick={() => handleDelete(banner.id)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-center text-slate-400 py-10">등록된 배너가 없습니다.</p>
        )}
      </div>
    </div>
  );
}