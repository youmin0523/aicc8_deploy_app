import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdSave,
  MdImage,
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
  MdAttachFile,
  MdClose,
} from 'react-icons/md';
import {
  fetchDiaryThunk,
  saveDiaryThunk,
  setSelectedDate,
} from '../../../redux/slices/privateCalendarSlice';
import { format, addDays, subDays } from 'date-fns';
import { toast } from 'react-toastify';

const DiaryTab = () => {
  const dispatch = useDispatch();
  const { authData } = useSelector((state) => state.auth);
  const { currentDiary, selectedDate, loading } = useSelector(
    (state) => state.privateCalendar,
  );
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (authData?.sub) {
      dispatch(fetchDiaryThunk({ userId: authData.sub, date: selectedDate }));
    }
  }, [selectedDate, authData?.sub, dispatch]);

  useEffect(() => {
    if (currentDiary) {
      setContent(currentDiary.content || '');
      try {
        if (currentDiary.images) {
          const parsed =
            typeof currentDiary.images[0] === 'string'
              ? currentDiary.images.map((imgUrl, i) => ({
                  id: i,
                  url: imgUrl,
                  name: `image_${i + 1}.jpg`,
                  type: 'image/jpeg',
                }))
              : currentDiary.images;
          setImages(parsed || []);
        } else {
          setImages([]);
        }
      } catch (e) {
        setImages([]);
      }
    } else {
      setContent('');
      setImages([]);
    }
  }, [currentDiary]);

  // [*Added Code] 파일 업로드 및 삭제 로직 추가 (CalendarTab 동기화)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: reader.result,
            name: file.name,
            type: file.type || '',
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.warn('내용을 입력해주세요.');
      return;
    }
    try {
      await dispatch(
        saveDiaryThunk({
          _id: currentDiary?._id,
          userId: authData.sub,
          entry_date: selectedDate,
          content,
          images,
        }),
      ).unwrap();
      toast.success('다이어리가 저장되었습니다.');
    } catch (err) {
      toast.error('저장 실패: ' + err.msg);
    }
  };

  const changeDate = (days) => {
    const newDate =
      days > 0
        ? addDays(new Date(selectedDate), days)
        : subDays(new Date(selectedDate), -days);
    dispatch(setSelectedDate(format(newDate, 'yyyy-MM-dd')));
  };

  return (
    <div className="flex flex-col h-full gap-8 animate-in fade-in duration-500">
      {/* 날짜 컨트롤러 */}
      <div className="flex items-center justify-between bg-black/30 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center gap-6">
          <button
            onClick={() => changeDate(-1)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
          >
            <MdChevronLeft size={28} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-1">
              Target Date
            </span>
            <h2 className="text-2xl font-black italic tracking-tighter text-white">
              {format(new Date(selectedDate), 'yyyy. MM. dd')}
            </h2>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
          >
            <MdChevronRight size={28} />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
        >
          <MdSave size={20} />
          {loading ? 'Transmitting...' : 'Save Record'}
        </button>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* 텍스트 에디터 영역 */}
        <div className="flex-1 flex flex-col bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">
              Manual Entry Console
            </span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 생각을 기록하세요..."
            className="flex-1 p-10 bg-transparent text-gray-300 focus:outline-none resize-none text-lg leading-relaxed custom-scrollbar"
          />
        </div>

        {/* 이미지/정보 사이드바 */}
        <div className="w-80 flex flex-col gap-6">
          <div className="bg-black/20 rounded-[2.5rem] border border-white/5 p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-2">
              <MdImage /> Visual Data
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {images.map((img, i) => {
                const isImage =
                  img.url?.startsWith('data:image') ||
                  img.type?.startsWith('image/') ||
                  img.name?.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i);

                return (
                  <div
                    key={img.id || i}
                    className="aspect-square bg-[#16181d] rounded-2xl border border-white/10 overflow-hidden group relative flex flex-col items-center justify-between shadow-2xl transition-all hover:-translate-y-1 z-10"
                  >
                    {isImage ? (
                      <div className="w-full flex-1 bg-black/40 overflow-hidden relative">
                        <img
                          src={img.url}
                          alt="preview"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                      </div>
                    ) : (
                      <div className="w-full flex-1 flex flex-col items-center justify-center p-2 text-gray-400 bg-white/5 relative">
                        <MdAttachFile
                          size={32}
                          className="mb-1 text-emerald-400/80 drop-shadow-lg"
                        />
                      </div>
                    )}

                    <div className="w-full h-[35px] bg-[#0f1115]/90 backdrop-blur-md flex items-center justify-center px-2 border-t border-white/5 shrink-0 z-10 relative">
                      <span className="text-[10px] font-bold text-gray-300 truncate w-full text-center tracking-wider">
                        {img.name || 'document.file'}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold z-20">
                      <button
                        onClick={() => removeImage(img.id)}
                        className="w-10 h-10 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full text-white flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all"
                      >
                        <MdClose size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {images.length === 0 && (
                <div className="aspect-square border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest text-[9px]">
                  Empty
                </div>
              )}
            </div>

            {/* Added Inputs for Image & Document (CalendarTab 동기화) */}
            <div className="flex gap-2">
              <label className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center transition-all group cursor-pointer z-10">
                <MdImage
                  size={24}
                  className="text-gray-600 group-hover:text-blue-500 mb-1 transition-colors"
                />
                <span className="text-[8px] font-black text-gray-400 group-hover:text-blue-400 uppercase tracking-widest transition-colors">
                  Image
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <label className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center transition-all group cursor-pointer z-10">
                <MdAttachFile
                  size={24}
                  className="text-gray-600 group-hover:text-emerald-500 mb-1 transition-colors"
                />
                <span className="text-[8px] font-black text-gray-400 group-hover:text-emerald-400 uppercase tracking-widest transition-colors">
                  Doc
                </span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <p className="text-[9px] text-gray-600 italic leading-tight uppercase font-bold mt-4">
              Supports JPG, PNG up to 5MB. Images are encrypted and stored in
              private nodes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-[2.5rem] border border-white/5 p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-4">
              Metadata
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 uppercase font-black">
                  Characters
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {content.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-gray-500 uppercase font-black">
                  Status
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-black">
                  SYNCED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryTab;
