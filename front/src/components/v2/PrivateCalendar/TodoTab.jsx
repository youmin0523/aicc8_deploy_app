import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MdAdd,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdFlag,
  MdEvent,
  MdLabel,
  MdDescription,
  MdClose,
  MdKeyboardArrowDown,
  MdSort,
  MdFilterAlt,
} from 'react-icons/md';
import { toast } from 'react-toastify';

const TodoTab = () => {
  // //* [Modified Code] Todo 리스트 상태 관리
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: '프로젝트 제안서 작성',
      priority: 'high',
      due_date: '오늘',
      description: 'AICC 8차 고도화 제안서 마무리하기',
      category: 'Work',
      completed: false,
    },
    {
      id: 2,
      title: '헬스장 가기',
      priority: 'medium',
      due_date: '내일',
      description: '하체 루틴 1시간',
      category: 'Life',
      completed: true,
    },
  ]);

  // //* [Modified Code] 카테고리 상태 관리 (사용자 추가 가능)
  const [categories, setCategories] = useState([
    'General',
    'Work',
    'Life',
    'Study',
    'Health',
    'etc',
  ]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // //* [Modified Code] 신규 할일 입력을 위한 상태 정의
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    priority: 'medium',
    due_date: 'today',
    custom_date: '',
    description: '',
    category: 'General',
  });

  // //* [Modified Code] 중요도별 스타일 및 라벨 설정
  const priorityConfig = {
    high: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'CRITICAL' },
    medium: {
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      label: 'NORMAL',
    },
    low: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'LOW' },
  };

  // //* [Modified Code] 신규 카테고리 추가 핸들러
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName)) {
      setCategories([
        ...categories.filter((c) => c !== 'etc'),
        newCategoryName,
        'etc',
      ]);
      setNewTodo({ ...newTodo, category: newCategoryName });
      setNewCategoryName('');
      setIsAddingCategory(false);
      toast.success(`Category Added: ${newCategoryName}`);
    }
  };

  // //* [Modified Code] 할일 완료 상태 토글 핸들러
  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    toast.success('Task Status Updated');
  };

  // //* [Modified Code] 신규 할일 생성 핸들러
  const handleCreateTodo = () => {
    if (!newTodo.title.trim()) {
      toast.error('Requirement: Todo Title is missing');
      return;
    }

    const todoToAdd = {
      id: Date.now(),
      ...newTodo,
      due_date:
        newTodo.due_date === 'custom' ? newTodo.custom_date : newTodo.due_date,
      completed: false,
    };

    setTodos([todoToAdd, ...todos]);
    setIsModalOpen(false);
    setNewTodo({
      title: '',
      priority: 'medium',
      due_date: 'today',
      custom_date: '',
      description: '',
      category: 'General',
    });
    toast.success('New Task Synchronized');
  };

  // //* [Added Code] 설명란 스마트 블릿 포인트 핸들러
  const handleDescriptionChange = (e) => {
    let value = e.target.value;
    // 첫 입력 시 - 가 없으면 추가
    if (value && !value.startsWith('- ')) {
      value = '- ' + value;
    }
    setNewTodo({ ...newTodo, description: value });
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = e.target;

      // 현재 커서 위치에 줄바꿈 + 블릿 포인트 삽입
      const newValue =
        value.substring(0, selectionStart) +
        '\n- ' +
        value.substring(selectionEnd);

      setNewTodo({ ...newTodo, description: newValue });

      // 커서 위치 조정을 위해 다음 렌더링 사이클에서 위치 설정
      const newCursorPos = selectionStart + 3;
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = newCursorPos;
      }, 0);
    }
  };

  return (
    <div className="flex gap-10 h-full max-h-full overflow-hidden animate-in slide-in-from-right-10 duration-500">
      {/* Search & List Section */}
      <div className="flex-1 flex flex-col gap-6 min-h-0">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
              <MdSort size={18} /> Active Tasks / {todos.length}
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-gray-500 hover:text-white transition-all">
                ALL
              </button>
              <button className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-gray-500 hover:text-white transition-all">
                PENDING
              </button>
              <button className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-black text-gray-500 hover:text-white transition-all">
                COMPLETED
              </button>
            </div>
          </div>
          <button className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all">
            <MdFilterAlt size={18} />
          </button>
        </header>

        {/* Todo List */}
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`group flex items-start justify-between p-6 rounded-[2.5rem] border transition-all duration-300 ${
                todo.completed
                  ? 'bg-blue-600/5 border-blue-500/20 opacity-60'
                  : 'bg-[#1a1c23]/50 border-white/5 hover:border-white/10 hover:bg-[#1a1c23]/80 shadow-lg'
              }`}
            >
              <div className="flex items-start gap-6">
                <button
                  onClick={() => handleToggleComplete(todo.id)}
                  className={`mt-1 transition-all duration-300 ${
                    todo.completed
                      ? 'text-blue-500'
                      : 'text-gray-600 hover:text-blue-400'
                  }`}
                >
                  {todo.completed ? (
                    <MdCheckCircle size={28} />
                  ) : (
                    <MdRadioButtonUnchecked size={28} />
                  )}
                </button>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4
                      className={`text-lg font-bold transition-all ${todo.completed ? 'text-gray-500 line-through italic' : 'text-white'}`}
                    >
                      {todo.title}
                    </h4>
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded-full ${priorityConfig[todo.priority].bg} ${priorityConfig[todo.priority].color} border border-current opacity-70`}
                    >
                      {priorityConfig[todo.priority].label}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${todo.completed ? 'text-gray-600' : 'text-gray-400'} max-w-xl`}
                  >
                    {todo.description}
                  </p>
                  <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-blue-500/60">
                      <MdLabel size={12} /> {todo.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-purple-400/60">
                      <MdEvent size={12} /> {todo.due_date}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-white/5 rounded-[3rem]">
              <MdSort size={60} className="mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">
                Clear Horizons
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Section */}
      <div className="w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all"></div>
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2 relative z-10">
            Initialize Task
          </h3>
          <p className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter mb-8 relative z-10 opacity-70 italic">
            Assign new mission parameters
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-white text-blue-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <MdAdd size={20} /> Create New Todo
          </button>
        </div>

        <div className="flex-1 bg-[#1a1c23]/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">
            Task Statistics
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-500">Global Completion</span>
                <span className="text-blue-500">
                  {todos.length > 0
                    ? Math.round(
                        (todos.filter((t) => t.completed).length /
                          todos.length) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-1000"
                  style={{
                    width: `${todos.length > 0 ? (todos.filter((t) => t.completed).length / todos.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                  Critical
                </p>
                <p className="text-xl font-black text-red-500">
                  {
                    todos.filter((t) => t.priority === 'high' && !t.completed)
                      .length
                  }
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                  Due Today
                </p>
                <p className="text-xl font-black text-white">
                  {
                    todos.filter((t) => t.due_date === '오늘' && !t.completed)
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Todo Modal (Using React Portal to avoid clipping) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1c23] w-full max-w-xl max-h-[90vh] flex flex-col rounded-[3rem] border border-white/10 p-8 shadow-[0_0_100px_rgba(37,99,235,0.4)]">
              <header className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                    New Task <span className="text-blue-500">Registry</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                    Define Objective and Priority
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 transition-all"
                >
                  <MdClose size={24} />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-500/80 flex items-center gap-2">
                    <MdRadioButtonUnchecked /> Task Objective
                  </label>
                  <input
                    type="text"
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="What needs to be accomplished?"
                  />
                </div>

                {/* Priority & Category (2열 배치) */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <MdFlag size={16} /> Priority Level
                    </label>
                    <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1">
                      {['low', 'medium', 'high'].map((p) => (
                        <button
                          key={p}
                          onClick={() =>
                            setNewTodo({ ...newTodo, priority: p })
                          }
                          className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            newTodo.priority === p
                              ? p === 'high'
                                ? 'bg-red-500 text-white'
                                : p === 'medium'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-blue-500 text-white'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <MdLabel size={16} /> Category
                      </label>
                      <button
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-1 transition-all"
                      >
                        <MdAdd size={14} /> Custom
                      </button>
                    </div>
                    {isAddingCategory ? (
                      <div className="flex gap-2 animate-in slide-in-from-top-2">
                        <input
                          autoFocus
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleAddCategory()
                          }
                          className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500/50"
                          placeholder="New Cat..."
                        />
                        <button
                          onClick={handleAddCategory}
                          className="px-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={newTodo.category}
                          onChange={(e) =>
                            setNewTodo({ ...newTodo, category: e.target.value })
                          }
                          className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <MdKeyboardArrowDown
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          size={20}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MdEvent size={16} /> Deadline Parameters
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: 'today', label: 'TODAY' },
                      { id: 'tomorrow', label: 'TOMORROW' },
                      { id: 'next_week', label: 'NEXT WEEK' },
                      { id: 'custom', label: 'SELECT DATE' },
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() =>
                          setNewTodo({ ...newTodo, due_date: d.id })
                        }
                        className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                          newTodo.due_date === d.id
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {newTodo.due_date === 'custom' && (
                    <div className="animate-in slide-in-from-top-2 mt-2 p-4 bg-black/60 rounded-3xl border border-white/5 space-y-3">
                      <p className="text-[10px] font-black text-blue-500/70 uppercase text-center tracking-widest">
                        Neural Interface Selection
                      </p>
                      <div className="relative group">
                        <input
                          type="date"
                          value={newTodo.custom_date}
                          onChange={(e) =>
                            setNewTodo({
                              ...newTodo,
                              custom_date: e.target.value,
                            })
                          }
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-4 text-lg font-black text-white focus:outline-none focus:border-blue-500/50 transition-all [color-scheme:dark] text-center tracking-widest cursor-pointer hover:bg-black/60"
                        />
                        <MdEvent
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500/50 group-hover:text-blue-500 transition-colors"
                          size={20}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <MdDescription size={16} /> Mission Details
                  </label>
                  <textarea
                    value={newTodo.description}
                    onChange={handleDescriptionChange}
                    onKeyDown={handleDescriptionKeyDown}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all min-h-[80px] resize-none"
                    placeholder="List sub-tasks (auto-bullets enabled)"
                  />
                </div>
              </div>

              <footer className="mt-6 shrink-0">
                <button
                  onClick={handleCreateTodo}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-blue-600/20 hover:scale-[1.02] transition-all duration-300"
                >
                  Launch Task Registry
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default TodoTab;
