import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdAdd,
  MdEvent,
  MdPlace,
  MdDescription,
  MdAttachFile,
  MdClose,
  MdRepeat,
  MdStar,
  MdDelete,
  MdCloudUpload,
  MdInsertDriveFile,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import {
  fetchSchedulesThunk,
  addScheduleThunk,
} from '../../../redux/slices/privateCalendarSlice';

const ScheduleTab = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.authData);
  const { schedules, loading } = useSelector((state) => state.privateCalendar);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    start_date: '',
    end_date: '',
    is_anniversary: false,
    repeat_type: 'none',
    place: '',
    description: '',
    attachments: [],
  });

  // //* [Modified Code] 초기 데이터 로드
  useEffect(() => {
    if (auth?.sub) {
      dispatch(fetchSchedulesThunk({ userId: auth.sub }));
    }
  }, [dispatch, auth]);

  // //* [Modified Code] 파일 첨부 핸들러 (썸네일 데이터 생성 포함)
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type.includes('image') ? 'image' : 'pdf',
            url: e.target.result, // 이미지의 경우 base64 데이터
            lastModified: file.lastModified,
          });
        };
        if (file.type.includes('image')) {
          reader.readAsDataURL(file);
        } else {
          // PDF 등은 URL 없이 이름만 처리하거나 아이콘으로 대체
          resolve({
            name: file.name,
            size: file.size,
            type: 'pdf',
            lastModified: file.lastModified,
          });
        }
      });
    });

    const newAttachments = await Promise.all(filePromises);
    setNewSchedule({
      ...newSchedule,
      attachments: [...newSchedule.attachments, ...newAttachments],
    });
    toast.info(`${files.length} file(s) attached`);
  };

  const removeAttachment = (index) => {
    setNewSchedule({
      ...newSchedule,
      attachments: newSchedule.attachments.filter((_, i) => i !== index),
    });
  };

  // //* [Modified Code] 일정 생성 핸들러
  const handleCreateSchedule = async () => {
    if (
      !newSchedule.title.trim() ||
      !newSchedule.start_date ||
      !newSchedule.end_date
    ) {
      toast.error(
        'Mission parameters incomplete: Title and Period are required',
      );
      return;
    }

    try {
      await dispatch(
        addScheduleThunk({
          userId: auth.sub,
          ...newSchedule,
        }),
      ).unwrap();

      toast.success('Schedule Vector Synchronized');
      setIsModalOpen(false);
      setNewSchedule({
        title: '',
        start_date: '',
        end_date: '',
        is_anniversary: false,
        repeat_type: 'none',
        place: '',
        description: '',
        attachments: [],
      });
      // 리스트 갱신
      dispatch(fetchSchedulesThunk({ userId: auth.sub }));
    } catch (err) {
      toast.error('Data Transmission Failed');
    }
  };

  return (
    <div className="flex gap-10 h-full max-h-full overflow-hidden animate-in slide-in-from-right-10 duration-500">
      {/* Schedule List Section */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
              <MdEvent size={18} /> Timeline Registry / {schedules.length}
            </h3>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="group relative flex items-start gap-6 p-6 rounded-[2.5rem] bg-[#1a1c23]/50 border border-white/5 hover:border-white/10 hover:bg-[#1a1c23]/80 transition-all duration-300 shadow-xl overflow-hidden"
            >
              {/* 기념일 마크 */}
              {schedule.is_anniversary && (
                <div className="absolute top-0 right-0 p-2 bg-yellow-500/20 text-yellow-500 rounded-bl-2xl">
                  <MdStar size={16} />
                </div>
              )}

              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 shrink-0">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">
                  {new Date(schedule.start_date).toLocaleString('en-US', {
                    month: 'short',
                  })}
                </span>
                <span className="text-2xl font-black text-white leading-none">
                  {new Date(schedule.start_date).getDate()}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {schedule.title}
                  </h4>
                  {schedule.repeat_type !== 'none' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[8px] font-black uppercase tracking-widest border border-purple-500/20">
                      <MdRepeat size={10} /> {schedule.repeat_type}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  {new Date(schedule.start_date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(schedule.end_date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                {schedule.place && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-1">
                    <MdPlace className="text-blue-500" /> {schedule.place}
                  </p>
                )}

                {schedule.description && (
                  <p className="text-sm text-gray-400 line-clamp-1 italic">
                    {schedule.description}
                  </p>
                )}

                {schedule.attachments && schedule.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-3">
                    {schedule.attachments.map((file, idx) => (
                      <div key={idx} className="relative group">
                        {file.type === 'image' && file.url ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-lg">
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[9px] font-black text-gray-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5 h-8">
                            <MdAttachFile size={10} /> {file.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {schedules.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <MdEvent size={60} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">
                No Events Scheduled
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2 relative z-10">
            Create Schedule
          </h3>
          <p className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter mb-8 relative z-10 opacity-70 italic">
            Define new temporal event
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MdAdd size={20} /> Deploy Schedule
          </button>
        </div>

        <div className="flex-1 bg-[#1a1c23]/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
            Temporal Insight
          </h3>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                Anniversaries
              </p>
              <p className="text-xl font-black text-yellow-500">
                {schedules.filter((s) => s.is_anniversary).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                Recurring Events
              </p>
              <p className="text-xl font-black text-white">
                {schedules.filter((s) => s.repeat_type !== 'none').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1c23] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[3rem] border border-white/10 p-10 shadow-[0_0_100px_rgba(37,99,235,0.4)]">
              <header className="flex justify-between items-center mb-8 shrink-0">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    Schedule <span className="text-blue-500">Registry</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Temporal mission parameters
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 transition-all"
                >
                  <MdClose size={24} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                    <MdEvent /> Schedule Title
                  </label>
                  <input
                    type="text"
                    value={newSchedule.title}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, title: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="Enter event designation..."
                  />
                </div>

                {/* Period Selection */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Start Temporal Point
                    </label>
                    <input
                      type="datetime-local"
                      value={newSchedule.start_date}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          start_date: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      End Temporal Point
                    </label>
                    <input
                      type="datetime-local"
                      value={newSchedule.end_date}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          end_date: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Anniversary & Repeat */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdStar className="text-yellow-500" /> Anniversary
                      Configuration
                    </label>
                    <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1">
                      {[true, false].map((val) => (
                        <button
                          key={val.toString()}
                          onClick={() =>
                            setNewSchedule({
                              ...newSchedule,
                              is_anniversary: val,
                            })
                          }
                          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            newSchedule.is_anniversary === val
                              ? 'bg-yellow-500 text-black'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {val ? 'YES' : 'NO'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdRepeat className="text-purple-500" /> Iteration Type
                    </label>
                    <select
                      value={newSchedule.repeat_type}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          repeat_type: e.target.value,
                        })
                      }
                      className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    >
                      <option value="none">NONE</option>
                      <option value="daily">DAILY</option>
                      <option value="weekly">WEEKLY</option>
                      <option value="monthly">MONTHLY</option>
                      <option value="yearly">YEARLY</option>
                    </select>
                  </div>
                </div>

                {/* Place */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MdPlace /> Geographical Node
                  </label>
                  <input
                    type="text"
                    value={newSchedule.place}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, place: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="Enter location designation..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MdDescription /> Narrative Data
                  </label>
                  <textarea
                    value={newSchedule.description}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all min-h-[100px] resize-none"
                    placeholder="Provide additional mission context..."
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MdAttachFile /> Data Fragments (Photo / PDF)
                  </label>
                  <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <MdCloudUpload
                      size={40}
                      className="text-blue-500 opacity-50"
                    />
                    <div className="text-center">
                      <p className="text-xs font-black uppercase text-gray-300 tracking-widest">
                        Upload Data
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold mt-1">
                        Select fragment from local storage
                      </p>
                    </div>
                  </div>

                  {newSchedule.attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {newSchedule.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 group relative overflow-hidden"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {file.type === 'image' && file.url ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <MdInsertDriveFile
                                className="shrink-0 text-blue-500"
                                size={24}
                              />
                            )}
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[10px] font-bold text-gray-300 truncate tracking-tighter">
                                {file.name}
                              </span>
                              <span className="text-[8px] text-gray-600 font-black uppercase">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeAttachment(idx)}
                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                          >
                            <MdDelete size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <footer className="mt-10 shrink-0">
                <button
                  onClick={handleCreateSchedule}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-blue-600/20 hover:scale-[1.02] transition-all duration-300"
                >
                  Confirm Schedule Deployment
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ScheduleTab;
