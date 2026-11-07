import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Moon,
  Sun,
  Calendar,
  Tag,
  AlertCircle,
  Download,
  Upload,
  Check,
  X,
  ListTodo,
  Sparkles,
  RotateCcw,
  Clock,
  Layers,
  ChevronDown,
  Settings,
  Pin,
  Volume2,
  VolumeX,
  Palette,
  CheckSquare,
  Square,
  Type,
  Maximize2,
  Minimize2,
  BookmarkPlus,
  Sliders,
  Timer
} from 'lucide-react';
import './App.css';

// Preset priorities
const PRIORITIES = [
  { id: 'low', label: 'Low', color: 'priority-low' },
  { id: 'medium', label: 'Medium', color: 'priority-medium' },
  { id: 'high', label: 'High', color: 'priority-high' },
  { id: 'urgent', label: 'Urgent', color: 'priority-urgent' }
];

// Default categories
const DEFAULT_CATEGORIES = [
  'General',
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Learning',
  'Projects'
];

// Accent color choices
const ACCENTS = [
  { id: 'blue', label: 'Ocean Blue', hex: '#3b82f6' },
  { id: 'indigo', label: 'Royal Indigo', hex: '#6366f1' },
  { id: 'purple', label: 'Deep Violet', hex: '#8b5cf6' },
  { id: 'rose', label: 'Sunset Rose', hex: '#f43f5e' },
  { id: 'amber', label: 'Warm Amber', hex: '#f59e0b' },
  { id: 'emerald', label: 'Fresh Emerald', hex: '#10b981' },
  { id: 'cyan', label: 'Vibrant Cyan', hex: '#06b6d4' }
];

// Quick templates for fast task creation
const TEMPLATES = [
  {
    label: '🌅 Morning Routine',
    title: 'Morning Productivity Routine',
    description: 'Hydrate, review calendar priorities, and clear urgent inbox messages.',
    category: 'Personal',
    priority: 'medium',
    subtasks: ['Drink 500ml water', 'Review day calendar', 'Inbox zero check']
  },
  {
    label: '💼 Team Standup',
    title: 'Daily Team Sync & Updates',
    description: 'Prepare yesterday achievements, today goals, and any blockers.',
    category: 'Work',
    priority: 'high',
    subtasks: ['Review yesterday PRs', 'List today milestones', 'Flag project blockers']
  },
  {
    label: '🛒 Weekly Groceries',
    title: 'Weekly Grocery Shopping',
    description: 'Pick up essential groceries and pantry staples for the week.',
    category: 'Shopping',
    priority: 'medium',
    subtasks: ['Fresh vegetables & fruit', 'Dairy / oat milk', 'Coffee beans', 'Whole grain bread']
  },
  {
    label: '🧠 Deep Work Session',
    title: 'Focused Deep Work Sprint (90m)',
    description: 'Zero distractions: silence notifications, close tabs, execute core task.',
    category: 'Projects',
    priority: 'urgent',
    subtasks: ['Set timer for 90m', 'Silence notifications', 'Complete target module']
  }
];

// Sample tasks for initial onboarding or reset
const SAMPLE_TASKS = [
  {
    id: 'sample-1',
    title: 'Upgrade To-Do App to React 19 & Vite 8',
    description: 'Modernized architecture with sub-300ms builds, dark mode, customizable themes, and subtasks.',
    completed: true,
    pinned: true,
    priority: 'urgent',
    category: 'Work',
    dueDate: new Date().toISOString().slice(0, 10),
    estimatedTime: '45m',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString(),
    subtasks: [
      { id: 's1', text: 'Replace CRA with Vite', completed: true },
      { id: 's2', text: 'Design adaptive dark & light themes', completed: true },
      { id: 's3', text: 'Add interactive customizations modal', completed: true }
    ]
  },
  {
    id: 'sample-2',
    title: 'Personalize theme & accent colors',
    description: 'Open the Customize panel (top right gear icon) and choose your favorite palette and font style.',
    completed: false,
    pinned: true,
    priority: 'high',
    category: 'Personal',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    estimatedTime: '15m',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's4', text: 'Select a custom accent color', completed: false },
      { id: 's5', text: 'Test OLED Pitch Black or Dark mode', completed: false }
    ]
  },
  {
    id: 'sample-3',
    title: 'Plan weekend outdoor hike',
    description: 'Check weather forecast, pack trail mix, water bottle, and offline trail maps.',
    completed: false,
    pinned: false,
    priority: 'medium',
    category: 'Health',
    dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10),
    estimatedTime: '2h',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's6', text: 'Check weather forecast', completed: false },
      { id: 's7', text: 'Prepare hiking gear', completed: false }
    ]
  }
];

export default function App() {
  // --------------------------------------------------------------------------
  // User Preferences & Customization State
  // --------------------------------------------------------------------------
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('taskMaster_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      theme: prefersDark ? 'dark' : 'light',
      accent: 'blue',
      font: 'sans',
      density: 'comfortable',
      soundEnabled: true,
      confettiEnabled: true,
      defaultPriority: 'medium',
      defaultCategory: 'General'
    };
  });

  // Custom user categories
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('taskMaster_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_CATEGORIES;
  });

  // New category form input inside settings
  const [newCatInput, setNewCatInput] = useState('');

  // --------------------------------------------------------------------------
  // Tasks State
  // --------------------------------------------------------------------------
  const [tasks, setTasks] = useState(() => {
    try {
      const modernTasks = localStorage.getItem('taskMaster_tasks');
      if (modernTasks) {
        return JSON.parse(modernTasks);
      }

      // Check legacy CRA storage keys
      const oldTodos = JSON.parse(localStorage.getItem('todoList') || '[]');
      const oldCompleted = JSON.parse(localStorage.getItem('completedTodoList') || '[]');

      if (oldTodos.length > 0 || oldCompleted.length > 0) {
        return [
          ...oldTodos.map((item, idx) => ({
            id: `legacy-todo-${idx}-${Date.now()}`,
            title: item.title || '',
            description: item.description || '',
            completed: false,
            pinned: false,
            priority: 'medium',
            category: 'General',
            dueDate: '',
            subtasks: [],
            createdAt: new Date().toISOString()
          })),
          ...oldCompleted.map((item, idx) => ({
            id: `legacy-comp-${idx}-${Date.now()}`,
            title: item.title || '',
            description: item.description || '',
            completed: true,
            pinned: false,
            priority: 'medium',
            category: 'General',
            dueDate: '',
            subtasks: [],
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          }))
        ];
      }

      // Default sample tasks for a pristine experience
      return SAMPLE_TASKS;
    } catch {
      return SAMPLE_TASKS;
    }
  });

  // --------------------------------------------------------------------------
  // Form Inputs State
  // --------------------------------------------------------------------------
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(preferences.defaultPriority || 'medium');
  const [category, setCategory] = useState(preferences.defaultCategory || 'General');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [currentSubtaskInput, setCurrentSubtaskInput] = useState('');

  // Editing state
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Tab & Filters
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'priority' | 'dueDate' | 'alphabetical'

  // Modals
  const [viewingTask, setViewingTask] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  // Floating Toast Notification
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // File import ref
  const fileInputRef = useRef(null);

  // --------------------------------------------------------------------------
  // Effects: Apply Preferences & DOM attributes
  // --------------------------------------------------------------------------
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', preferences.theme);
    root.setAttribute('data-accent', preferences.accent);
    root.setAttribute('data-font', preferences.font);
    root.setAttribute('data-density', preferences.density);

    localStorage.setItem('taskMaster_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Persist categories
  useEffect(() => {
    localStorage.setItem('taskMaster_categories', JSON.stringify(categories));
  }, [categories]);

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem('taskMaster_tasks', JSON.stringify(tasks));

      // Keep legacy format updated for backwards compatibility
      const activeLegacy = tasks.filter(t => !t.completed).map(t => ({ title: t.title, description: t.description }));
      const completedLegacy = tasks.filter(t => t.completed).map(t => ({ title: t.title, description: t.description }));
      localStorage.setItem('todoList', JSON.stringify(activeLegacy));
      localStorage.setItem('completedTodoList', JSON.stringify(completedLegacy));
    } catch (err) {
      console.error('Failed to save tasks', err);
    }
  }, [tasks]);

  // --------------------------------------------------------------------------
  // Helpers: Sound & Toast
  // --------------------------------------------------------------------------
  const showToast = (message, type = 'info') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Harmonious Web Audio synthesizer chime
  const playCompletionSound = () => {
    if (!preferences.soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';

      // 3-tone arpeggio: C5 -> E5 -> G5
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio context restricted or unavailable
    }
  };

  // Confetti celebration
  const triggerConfetti = () => {
    if (!preferences.confettiEnabled) return;
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']
      });
    } catch {
      // Ignore
    }
  };

  // --------------------------------------------------------------------------
  // Task Handlers
  // --------------------------------------------------------------------------
  const handleSubmitTask = (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a task title', 'warning');
      return;
    }

    if (editingTaskId) {
      setTasks(prev =>
        prev.map(task => {
          if (task.id === editingTaskId) {
            return {
              ...task,
              title: title.trim(),
              description: description.trim(),
              priority,
              category,
              dueDate,
              estimatedTime: estimatedTime.trim(),
              subtasks: subtasks,
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        })
      );
      showToast('Task updated successfully!', 'success');
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        pinned: false,
        priority,
        category,
        dueDate,
        estimatedTime: estimatedTime.trim(),
        subtasks: subtasks,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Task added to your list', 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(preferences.defaultPriority || 'medium');
    setCategory(preferences.defaultCategory || 'General');
    setDueDate('');
    setEstimatedTime('');
    setSubtasks([]);
    setCurrentSubtaskInput('');
    setEditingTaskId(null);
  };

  const applyTemplate = (tpl) => {
    setTitle(tpl.title);
    setDescription(tpl.description);
    setCategory(tpl.category);
    setPriority(tpl.priority);
    setSubtasks(tpl.subtasks.map((text, idx) => ({ id: `st-${Date.now()}-${idx}`, text, completed: false })));
    showToast(`Template applied: ${tpl.label}`, 'info');
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setCategory(task.category || 'General');
    setDueDate(task.dueDate || '');
    setEstimatedTime(task.estimatedTime || '');
    setSubtasks(task.subtasks || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing "${task.title}"`, 'info');
  };

  const cancelEdit = () => {
    resetForm();
    showToast('Editing cancelled', 'info');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const willBeCompleted = !task.completed;
          if (willBeCompleted) {
            playCompletionSound();
            triggerConfetti();
            showToast('Task completed! Great job 🎉', 'success');
          } else {
            showToast('Task moved back to active', 'info');
          }
          return {
            ...task,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  };

  const togglePinTask = (id, e) => {
    if (e) e.stopPropagation();
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const isNowPinned = !task.pinned;
          showToast(isNowPinned ? 'Task pinned to top 📌' : 'Task unpinned', 'info');
          return { ...task, pinned: isNowPinned };
        }
        return task;
      })
    );
  };

  // Subtask management
  const handleAddSubtask = () => {
    if (!currentSubtaskInput.trim()) return;
    const newSt = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: currentSubtaskInput.trim(),
      completed: false
    };
    setSubtasks(prev => [...prev, newSt]);
    setCurrentSubtaskInput('');
  };

  const handleRemoveSubtask = (stId) => {
    setSubtasks(prev => prev.filter(st => st.id !== stId));
  };

  const handleToggleSubtaskInTask = (taskId, subtaskId, e) => {
    if (e) e.stopPropagation();
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = (task.subtasks || []).map(st => {
            if (st.id === subtaskId) {
              return { ...st, completed: !st.completed };
            }
            return st;
          });
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  };

  // Delete Task
  const promptDeleteTask = (task) => {
    setConfirmDialog({
      title: 'Delete Task',
      message: `Are you sure you want to permanently delete "${task.title}"?`,
      confirmText: 'Delete',
      isDanger: true,
      onConfirm: () => {
        setTasks(prev => prev.filter(t => t.id !== task.id));
        if (editingTaskId === task.id) resetForm();
        setConfirmDialog(null);
        showToast('Task deleted', 'danger');
      }
    });
  };

  // Clear completed tasks
  const promptClearCompleted = () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear', 'info');
      return;
    }

    setConfirmDialog({
      title: 'Clear Completed Tasks',
      message: `Are you sure you want to remove all ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`,
      confirmText: 'Clear All',
      isDanger: true,
      onConfirm: () => {
        setTasks(prev => prev.filter(t => !t.completed));
        setConfirmDialog(null);
        showToast(`Cleared ${completedCount} completed tasks`, 'success');
      }
    });
  };

  // Category management in settings
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      showToast('Category already exists', 'warning');
      return;
    }
    setCategories(prev => [...prev, trimmed]);
    setNewCatInput('');
    showToast(`Added category: "${trimmed}"`, 'success');
  };

  const handleRemoveCategory = (catName) => {
    if (catName === 'General') {
      showToast('Cannot delete default "General" category', 'warning');
      return;
    }
    setCategories(prev => prev.filter(c => c !== catName));
    showToast(`Deleted category "${catName}"`, 'info');
  };

  // Reset to sample tasks
  const promptResetToSample = () => {
    setConfirmDialog({
      title: 'Load Sample Tasks',
      message: 'This will replace your current tasks with interactive sample tasks. Continue?',
      confirmText: 'Load Samples',
      isDanger: false,
      onConfirm: () => {
        setTasks(SAMPLE_TASKS);
        setConfirmDialog(null);
        showToast('Sample tasks loaded', 'success');
      }
    });
  };

  // Clear all data
  const promptClearAllData = () => {
    setConfirmDialog({
      title: 'Clear All Tasks',
      message: 'This will delete ALL active and completed tasks permanently. Are you sure?',
      confirmText: 'Delete Everything',
      isDanger: true,
      onConfirm: () => {
        setTasks([]);
        resetForm();
        setConfirmDialog(null);
        showToast('All tasks cleared', 'danger');
      }
    });
  };

  // Export / Import
  const exportTasks = () => {
    try {
      const backupData = {
        version: '1.2.0',
        exportedAt: new Date().toISOString(),
        preferences,
        categories,
        tasks
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `taskmaster-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Full backup exported to JSON file', 'success');
    } catch {
      showToast('Failed to export tasks', 'danger');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        let taskList = [];

        // Handle full backup object format
        if (imported && imported.tasks && Array.isArray(imported.tasks)) {
          taskList = imported.tasks;
          if (imported.preferences) setPreferences(imported.preferences);
          if (imported.categories) setCategories(imported.categories);
        } else if (Array.isArray(imported)) {
          taskList = imported;
        } else {
          showToast('Invalid backup file format', 'danger');
          return;
        }

        const normalized = taskList.map((item, idx) => ({
          id: item.id || `imported-${idx}-${Date.now()}`,
          title: item.title || 'Untitled Task',
          description: item.description || '',
          completed: Boolean(item.completed),
          pinned: Boolean(item.pinned),
          priority: item.priority || 'medium',
          category: item.category || 'General',
          dueDate: item.dueDate || '',
          estimatedTime: item.estimatedTime || '',
          subtasks: item.subtasks || [],
          createdAt: item.createdAt || new Date().toISOString(),
          completedAt: item.completedAt || (item.completed ? new Date().toISOString() : undefined)
        }));

        setTasks(normalized);
        showToast(`Imported ${normalized.length} tasks and preferences!`, 'success');
      } catch {
        showToast('Error reading backup file', 'danger');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewingTask) setViewingTask(null);
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (confirmDialog) setConfirmDialog(null);
        if (editingTaskId) cancelEdit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingTask, isSettingsOpen, confirmDialog, editingTaskId]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, percent };
  }, [tasks]);

  // Filter & Sort Tasks (Pinned always first)
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (activeTab === 'active' && task.completed) return false;
        if (activeTab === 'completed' && !task.completed) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (task.title || '').toLowerCase().includes(q);
          const matchDesc = (task.description || '').toLowerCase().includes(q);
          const matchCat = (task.category || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        if (selectedCategoryFilter !== 'All' && task.category !== selectedCategoryFilter) return false;
        if (selectedPriorityFilter !== 'All' && task.priority !== selectedPriorityFilter.toLowerCase()) return false;

        return true;
      })
      .sort((a, b) => {
        // Pinned tasks always bubble up
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }

        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'alphabetical') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'priority') {
          const weight = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (weight[b.priority] || 2) - (weight[a.priority] || 2);
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
      });
  }, [tasks, activeTab, searchQuery, selectedCategoryFilter, selectedPriorityFilter, sortBy]);

  // Date formatting helpers
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return dateString;
    }
  };

  const getDueDateStatus = (dueDateString, isCompleted) => {
    if (!dueDateString || isCompleted) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateString);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Overdue ${Math.abs(diffDays)}d`, status: 'overdue' };
    }
    if (diffDays === 0) {
      return { label: 'Due Today', status: 'today' };
    }
    if (diffDays === 1) {
      return { label: 'Due Tomorrow', status: 'upcoming' };
    }
    return { label: `Due in ${diffDays}d`, status: 'normal' };
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* App Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <ListTodo size={26} className="icon-pulse" />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">TaskMaster</h1>
            </div>
            <p className="brand-subtitle">Smart task manager with rich customizations & insights</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Export / Import */}
          <button
            className="action-btn"
            onClick={exportTasks}
            title="Export tasks to JSON backup"
            aria-label="Export backup"
          >
            <Download size={17} />
            <span className="btn-label-desktop">Export</span>
          </button>

          <button
            className="action-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Import tasks from JSON backup"
            aria-label="Import backup"
          >
            <Upload size={17} />
            <span className="btn-label-desktop">Import</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            style={{ display: 'none' }}
          />

          {/* Quick Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={() => {
              setPreferences(prev => ({
                ...prev,
                theme: prev.theme === 'light' ? 'dark' : prev.theme === 'dark' ? 'oled' : 'light'
              }));
            }}
            title={`Current: ${preferences.theme.toUpperCase()} (Click to cycle Light/Dark/OLED)`}
            aria-label="Toggle theme"
          >
            {preferences.theme === 'light' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Customization / Settings Gear */}
          <button
            className="action-btn settings-gear-btn"
            onClick={() => setIsSettingsOpen(true)}
            title="Open Customizations & Settings"
            aria-label="Open settings"
          >
            <Settings size={18} />
            <span className="btn-label-desktop">Customize</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Productivity Dashboard */}
        <section className="stats-dashboard card">
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Pending</span>
              <span className="stat-value stat-pending">{stats.active}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed</span>
              <span className="stat-value stat-completed">{stats.completed}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Progress</span>
              <span className="stat-value stat-percent">{stats.percent}%</span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${stats.percent}%` }}
              role="progressbar"
              aria-valuenow={stats.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </section>

        {/* Task Form Section */}
        <section className="form-section card">
          {/* Quick Templates Pill Bar */}
          {!editingTaskId && (
            <div className="templates-bar">
              <span className="templates-label">
                <Sparkles size={14} /> Quick Templates:
              </span>
              <div className="templates-list">
                {TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="template-pill"
                    onClick={() => applyTemplate(tpl)}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {editingTaskId && (
            <div className="editing-banner">
              <div className="banner-left">
                <Edit3 size={16} />
                <span>Editing Task</span>
              </div>
              <button className="cancel-edit-btn" onClick={cancelEdit}>
                <X size={14} /> Cancel
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitTask} className="task-form">
            <div className="form-group">
              <label htmlFor="task-title" className="form-label">
                Task Title <span className="required-star">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be accomplished?"
                autoFocus={Boolean(editingTaskId)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-desc" className="form-label">
                Description / Notes
              </label>
              <textarea
                id="task-desc"
                className="input-field textarea-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes, instructions, or links..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleSubmitTask(e);
                  }
                }}
              />
            </div>

            {/* Subtasks Builder */}
            <div className="form-group subtasks-builder">
              <label className="form-label-sm">
                Checklist / Subtasks ({subtasks.length})
              </label>
              <div className="subtask-input-row">
                <input
                  type="text"
                  className="input-field input-subtask"
                  placeholder="Add a step (e.g. Gather documents)..."
                  value={currentSubtaskInput}
                  onChange={(e) => setCurrentSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-add-subtask"
                  onClick={handleAddSubtask}
                  disabled={!currentSubtaskInput.trim()}
                >
                  <Plus size={16} /> Add Step
                </button>
              </div>

              {subtasks.length > 0 && (
                <div className="subtask-tags-list">
                  {subtasks.map((st) => (
                    <div key={st.id} className="subtask-tag-item">
                      <span>{st.text}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="subtask-remove-btn"
                        aria-label="Remove subtask"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata inputs */}
            <div className="form-meta-row">
              <div className="meta-field">
                <label className="form-label-sm">Priority</label>
                <div className="select-wrapper">
                  <select
                    className="input-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>

              <div className="meta-field">
                <label className="form-label-sm">Category</label>
                <div className="select-wrapper">
                  <select
                    className="input-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>

              <div className="meta-field">
                <label htmlFor="due-date" className="form-label-sm">Due Date</label>
                <input
                  id="due-date"
                  type="date"
                  className="input-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="meta-field">
                <label htmlFor="est-time" className="form-label-sm">Est. Time</label>
                <input
                  id="est-time"
                  type="text"
                  className="input-field input-est"
                  placeholder="e.g. 30m, 2h"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className={`btn-primary ${editingTaskId ? 'btn-update' : ''}`}
                disabled={!title.trim()}
              >
                {editingTaskId ? (
                  <>
                    <Check size={18} />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Add Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Task Management & List */}
        <section className="tasks-section card">
          {/* Tab Toolbar */}
          <div className="tasks-toolbar">
            <div className="tab-group" role="tablist">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
                role="tab"
                aria-selected={activeTab === 'all'}
              >
                All <span className="tab-badge">{stats.total}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
                role="tab"
                aria-selected={activeTab === 'active'}
              >
                In Progress <span className="tab-badge">{stats.active}</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
                role="tab"
                aria-selected={activeTab === 'completed'}
              >
                Completed <span className="tab-badge">{stats.completed}</span>
              </button>
            </div>

            {stats.completed > 0 && activeTab !== 'active' && (
              <button
                className="btn-clear-completed"
                onClick={promptClearCompleted}
                title="Remove all completed tasks"
              >
                <RotateCcw size={14} /> Clear Completed
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <div className="filter-controls">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks, descriptions, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-dropdowns">
              <div className="filter-select-wrapper">
                <Tag size={14} className="filter-icon" />
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-select-wrapper">
                <Filter size={14} className="filter-icon" />
                <select
                  value={selectedPriorityFilter}
                  onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                  className="filter-select"
                  aria-label="Filter by priority"
                >
                  <option value="All">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="filter-select-wrapper">
                <ArrowUpDown size={14} className="filter-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                  aria-label="Sort tasks by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">Priority (High to Low)</option>
                  <option value="dueDate">Due Date (Earliest)</option>
                  <option value="alphabetical">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  {searchQuery || selectedCategoryFilter !== 'All' || selectedPriorityFilter !== 'All' ? (
                    <Search size={32} />
                  ) : activeTab === 'completed' ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <Sparkles size={32} />
                  )}
                </div>
                <h3 className="empty-title">
                  {searchQuery || selectedCategoryFilter !== 'All' || selectedPriorityFilter !== 'All'
                    ? 'No matching tasks found'
                    : activeTab === 'completed'
                    ? 'No completed tasks yet'
                    : 'All clear! Ready to plan ahead?'}
                </h3>
                <p className="empty-subtitle">
                  {searchQuery || selectedCategoryFilter !== 'All' || selectedPriorityFilter !== 'All'
                    ? 'Try adjusting your search query or reset your filters.'
                    : activeTab === 'completed'
                    ? 'Check off active tasks to track them here.'
                    : 'Choose a quick template above or create a new custom task.'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const dueStatus = getDueDateStatus(task.dueDate, task.completed);
                const subtasksCount = (task.subtasks || []).length;
                const completedSubtasksCount = (task.subtasks || []).filter(s => s.completed).length;

                return (
                  <div
                    key={task.id}
                    className={`task-item ${task.completed ? 'task-completed' : ''} ${
                      task.pinned ? 'task-pinned' : ''
                    } ${editingTaskId === task.id ? 'task-being-edited' : ''}`}
                  >
                    {/* Checkbox */}
                    <button
                      className="task-checkbox-btn"
                      onClick={() => toggleTaskCompletion(task.id)}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={22} className="check-icon-completed" />
                      ) : (
                        <Circle size={22} className="check-icon-idle" />
                      )}
                    </button>

                    {/* Task Info Body */}
                    <div className="task-details" onClick={() => setViewingTask(task)}>
                      <div className="task-title-row">
                        {task.pinned && (
                          <span className="pinned-badge" title="Pinned to top">
                            <Pin size={12} className="pinned-icon" /> Pinned
                          </span>
                        )}
                        <h3 className="task-title">{task.title}</h3>
                        {dueStatus && (
                          <span className={`due-badge due-${dueStatus.status}`}>
                            <Clock size={11} /> {dueStatus.label}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="task-desc">{task.description}</p>
                      )}

                      {/* Subtasks Progress / Mini Checklist */}
                      {subtasksCount > 0 && (
                        <div className="task-subtasks-preview">
                          <div className="subtask-progress-header">
                            <CheckSquare size={13} className="subtask-icon" />
                            <span>
                              {completedSubtasksCount} of {subtasksCount} steps completed
                            </span>
                          </div>
                          <div className="subtask-mini-bar">
                            <div
                              className="subtask-mini-fill"
                              style={{ width: `${(completedSubtasksCount / subtasksCount) * 100}%` }}
                            />
                          </div>

                          {/* Quick checklist toggles */}
                          <div className="subtasks-interactive-list">
                            {task.subtasks.map((st) => (
                              <button
                                key={st.id}
                                className={`subtask-item-btn ${st.completed ? 'subtask-done' : ''}`}
                                onClick={(e) => handleToggleSubtaskInTask(task.id, st.id, e)}
                                title={st.completed ? 'Mark step incomplete' : 'Mark step complete'}
                              >
                                {st.completed ? <CheckSquare size={13} /> : <Square size={13} />}
                                <span>{st.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Badges row */}
                      <div className="task-tags">
                        <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                          {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
                        </span>
                        <span className="category-badge">
                          {task.category || 'General'}
                        </span>
                        {task.estimatedTime && (
                          <span className="est-badge">
                            <Timer size={11} /> {task.estimatedTime}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="date-badge">
                            <Calendar size={12} /> {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="task-actions">
                      <button
                        className={`task-action-btn pin-btn ${task.pinned ? 'pin-active' : ''}`}
                        onClick={(e) => togglePinTask(task.id, e)}
                        title={task.pinned ? 'Unpin Task' : 'Pin Task to Top'}
                        aria-label="Pin task"
                      >
                        <Pin size={17} />
                      </button>

                      <button
                        className="task-action-btn view-btn"
                        onClick={() => setViewingTask(task)}
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="task-action-btn edit-btn"
                        onClick={() => startEditTask(task)}
                        title="Edit Task"
                        aria-label="Edit Task"
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        className="task-action-btn delete-btn"
                        onClick={() => promptDeleteTask(task)}
                        title="Delete Task"
                        aria-label="Delete Task"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* ======================================================================
          Settings & Customizations Modal
          ====================================================================== */}
      {isSettingsOpen && (
        <div className="modal-backdrop" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-card settings-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Sliders size={20} className="icon-primary" />
                <h3 className="settings-heading">App Customizations & Preferences</h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close settings"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body settings-body">
              {/* 1. Theme Selection */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Moon size={16} /> Theme & Display
                </h4>
                <div className="theme-options-grid">
                  <button
                    className={`theme-option-btn ${preferences.theme === 'light' ? 'selected' : ''}`}
                    onClick={() => setPreferences(p => ({ ...p, theme: 'light' }))}
                  >
                    <Sun size={18} /> Light
                  </button>
                  <button
                    className={`theme-option-btn ${preferences.theme === 'dark' ? 'selected' : ''}`}
                    onClick={() => setPreferences(p => ({ ...p, theme: 'dark' }))}
                  >
                    <Moon size={18} /> Dark
                  </button>
                  <button
                    className={`theme-option-btn ${preferences.theme === 'oled' ? 'selected' : ''}`}
                    onClick={() => setPreferences(p => ({ ...p, theme: 'oled' }))}
                  >
                    <div className="oled-swatch" /> OLED Black
                  </button>
                </div>
              </div>

              {/* 2. Accent Color Palette */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Palette size={16} /> Accent Color
                </h4>
                <div className="accent-swatches-grid">
                  {ACCENTS.map(acc => (
                    <button
                      key={acc.id}
                      className={`accent-swatch-btn ${preferences.accent === acc.id ? 'active' : ''}`}
                      onClick={() => setPreferences(p => ({ ...p, accent: acc.id }))}
                      title={acc.label}
                    >
                      <span className="swatch-circle" style={{ backgroundColor: acc.hex }} />
                      <span className="swatch-label">{acc.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Typography / Font Style */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Type size={16} /> Font Family
                </h4>
                <div className="font-options-grid">
                  {[
                    { id: 'sans', label: 'Plus Jakarta Sans', sample: 'Modern & Clean' },
                    { id: 'mono', label: 'JetBrains Mono', sample: 'Code & Precise' },
                    { id: 'serif', label: 'Editorial Serif', sample: 'Warm & Elegant' },
                    { id: 'readable', label: 'System Humanist', sample: 'High Legibility' }
                  ].map(f => (
                    <button
                      key={f.id}
                      className={`font-option-btn ${preferences.font === f.id ? 'selected' : ''}`}
                      onClick={() => setPreferences(p => ({ ...p, font: f.id }))}
                    >
                      <span className="font-name">{f.label}</span>
                      <span className="font-preview">{f.sample}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Display Density */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Layers size={16} /> Display Density
                </h4>
                <div className="density-toggle-group">
                  <button
                    className={`density-btn ${preferences.density === 'comfortable' ? 'selected' : ''}`}
                    onClick={() => setPreferences(p => ({ ...p, density: 'comfortable' }))}
                  >
                    <Maximize2 size={16} /> Comfortable (Spacious)
                  </button>
                  <button
                    className={`density-btn ${preferences.density === 'compact' ? 'selected' : ''}`}
                    onClick={() => setPreferences(p => ({ ...p, density: 'compact' }))}
                  >
                    <Minimize2 size={16} /> Compact (High Density)
                  </button>
                </div>
              </div>

              {/* 5. Audio & Delights */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Volume2 size={16} /> Feedback & Delights
                </h4>
                <div className="switch-row">
                  <label htmlFor="sound-toggle" className="switch-label">
                    <span>Task Completion Chime</span>
                    <span className="switch-desc">Play a gentle tone when checking off tasks</span>
                  </label>
                  <input
                    id="sound-toggle"
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => setPreferences(p => ({ ...p, soundEnabled: e.target.checked }))}
                  />
                </div>

                <div className="switch-row">
                  <label htmlFor="confetti-toggle" className="switch-label">
                    <span>Celebration Confetti</span>
                    <span className="switch-desc">Burst confetti particles when completing tasks</span>
                  </label>
                  <input
                    id="confetti-toggle"
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={preferences.confettiEnabled}
                    onChange={(e) => setPreferences(p => ({ ...p, confettiEnabled: e.target.checked }))}
                  />
                </div>
              </div>

              {/* 6. Custom Categories Management */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <Tag size={16} /> Manage Categories
                </h4>
                <div className="category-manager-input">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="New category name (e.g. Finance)..."
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-cat"
                    onClick={handleAddCategory}
                    disabled={!newCatInput.trim()}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="manage-categories-chips">
                  {categories.map(cat => (
                    <span key={cat} className="manage-cat-chip">
                      {cat}
                      {cat !== 'General' && (
                        <button
                          type="button"
                          className="chip-delete-btn"
                          onClick={() => handleRemoveCategory(cat)}
                          title={`Delete ${cat}`}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* 7. Data & Presets */}
              <div className="setting-group">
                <h4 className="setting-title">
                  <BookmarkPlus size={16} /> Data & Presets
                </h4>
                <div className="data-actions-row">
                  <button className="btn-secondary-action" onClick={promptResetToSample}>
                    <Sparkles size={16} /> Load Sample Tasks
                  </button>
                  <button className="btn-secondary-action" onClick={exportTasks}>
                    <Download size={16} /> Export Backup
                  </button>
                  <button className="btn-danger-outline" onClick={promptClearAllData}>
                    <Trash2 size={16} /> Clear All Tasks
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-primary"
                onClick={() => setIsSettingsOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          Task Details Modal
          ====================================================================== */}
      {viewingTask && (
        <div className="modal-backdrop" onClick={() => setViewingTask(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                {viewingTask.pinned && (
                  <span className="pinned-badge">
                    <Pin size={12} /> Pinned
                  </span>
                )}
                <span className={`priority-badge priority-${viewingTask.priority || 'medium'}`}>
                  {(viewingTask.priority || 'medium').toUpperCase()}
                </span>
                <span className="category-badge">{viewingTask.category || 'General'}</span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setViewingTask(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <h2 className="modal-task-title">{viewingTask.title}</h2>

              <div className="modal-section">
                <h4 className="modal-section-heading">Description</h4>
                <div className="modal-description-box">
                  {viewingTask.description ? (
                    <p>{viewingTask.description}</p>
                  ) : (
                    <span className="text-muted-italics">No additional description provided.</span>
                  )}
                </div>
              </div>

              {/* Subtasks checklist inside details modal */}
              {viewingTask.subtasks && viewingTask.subtasks.length > 0 && (
                <div className="modal-section">
                  <h4 className="modal-section-heading">
                    Checklist ({viewingTask.subtasks.filter(s => s.completed).length} / {viewingTask.subtasks.length})
                  </h4>
                  <div className="modal-subtask-list">
                    {viewingTask.subtasks.map((st) => (
                      <div
                        key={st.id}
                        className={`modal-subtask-row ${st.completed ? 'subtask-done' : ''}`}
                        onClick={() => handleToggleSubtaskInTask(viewingTask.id, st.id)}
                      >
                        {st.completed ? <CheckSquare size={16} className="text-success" /> : <Square size={16} />}
                        <span>{st.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-metadata-grid">
                <div className="meta-tile">
                  <span className="meta-tile-label">Status</span>
                  <span className={`status-pill ${viewingTask.completed ? 'status-pill-completed' : 'status-pill-active'}`}>
                    {viewingTask.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                {viewingTask.estimatedTime && (
                  <div className="meta-tile">
                    <span className="meta-tile-label">Estimated Time</span>
                    <span className="meta-tile-val">{viewingTask.estimatedTime}</span>
                  </div>
                )}

                {viewingTask.dueDate && (
                  <div className="meta-tile">
                    <span className="meta-tile-label">Due Date</span>
                    <span className="meta-tile-val">{formatDate(viewingTask.dueDate)}</span>
                  </div>
                )}

                <div className="meta-tile">
                  <span className="meta-tile-label">Created At</span>
                  <span className="meta-tile-val">{formatDate(viewingTask.createdAt)}</span>
                </div>

                {viewingTask.completedAt && (
                  <div className="meta-tile">
                    <span className="meta-tile-label">Completed At</span>
                    <span className="meta-tile-val">{formatDate(viewingTask.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-modal-action"
                onClick={() => {
                  const taskToEdit = viewingTask;
                  setViewingTask(null);
                  startEditTask(taskToEdit);
                }}
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                className="btn-modal-primary"
                onClick={() => setViewingTask(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          Confirmation Dialog Modal
          ====================================================================== */}
      {confirmDialog && (
        <div className="modal-backdrop" onClick={() => setConfirmDialog(null)}>
          <div className="modal-card modal-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <AlertCircle size={28} className={confirmDialog.isDanger ? 'icon-danger' : 'icon-primary'} />
            </div>
            <h3 className="confirm-title">{confirmDialog.title}</h3>
            <p className="confirm-message">{confirmDialog.message}</p>

            <div className="confirm-actions">
              <button
                className="btn-confirm-cancel"
                onClick={() => setConfirmDialog(null)}
              >
                Cancel
              </button>
              <button
                className={`btn-confirm-action ${confirmDialog.isDanger ? 'btn-danger' : 'btn-primary'}`}
                onClick={confirmDialog.onConfirm}
              >
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
