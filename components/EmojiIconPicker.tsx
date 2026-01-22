"use client";

import React, { useState } from "react";
import { 
  Smile, Star, Heart, Award, CheckCircle, XCircle, AlertCircle, Info, Zap, Target, TrendingUp, 
  Users, Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, 
  Facebook, Instagram, Youtube, Calendar, Clock, DollarSign, Percent, ArrowRight, ArrowLeft, 
  ArrowUp, ArrowDown, Plus, Minus, Check, X, Code, Database, Server, Cloud, Shield, Lock, 
  Key, FileText, FileCode, Terminal, Cpu, HardDrive, Wifi, Monitor, Smartphone, 
  Tablet, Laptop, Camera, Video, Mic, Headphones, Music, Book, BookOpen, School, 
  Building, Code2, GitBranch, GitCommit, GitMerge, GitPullRequest, 
  BarChart, LineChart, PieChart, TrendingDown, Activity,
  FileCheck, FileX, FileEdit, FileSearch, Download, Upload, Share2, Link, ExternalLink,
  Copy, Clipboard, ClipboardCheck, Scissors, Edit, Image, Film,
  Play, Pause, Settings, Cog, Wrench, Hammer, Search, Filter, Bell, Eye, EyeOff,
  User, UserCheck, UserPlus, UserMinus, UserX, UserCircle, MessageCircle, MessageSquare,
  Send, Inbox, Trash2, Save, RefreshCw, RotateCw, RotateCcw, Repeat, Shuffle,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown, MoreHorizontal, MoreVertical,
  Menu, Grid3x3, LayoutGrid, Sidebar, PanelLeft, PanelRight, Layers, Grid, Layout,
  Columns, Rows, Maximize, Minimize, Battery, BatteryCharging, Power, Plug, PlugZap,
  WifiOff, Signal, SignalHigh, SignalLow, SignalZero, RadioReceiver, Broadcast,
  Satellite, SatelliteDish, Earth, MapPinned, Navigation2, PlaneTakeoff, PlaneLanding,
  CarFront, Anchor, RocketLaunch, Space, Telescope, Lightbulb, LightbulbOff, Flame,
  Droplet, Leaf, Flower, Flower2, Tree, TreePine, Sun, Moon, CloudRain, CloudSnow,
  CloudLightning, CloudDrizzle, Snowflake, Wind, Umbrella, UmbrellaOff, Rainbow,
  Gift, Trophy, Medal, Crown, Gem, Diamond, Coins, Wallet, CreditCard, Receipt,
  ShoppingCart, Package, Box, Archive, Folder, FolderOpen, File, Palette, Paintbrush,
  Brush, Eraser, Unlock, Building2, Factory, Hotel,
  Hospital, University, Library, Bookmark, Notebook, StickyNote, Files,
  Boxes, Warehouse, Store, ShoppingBag, ShoppingBasket
} from "lucide-react";

type EmojiIconPickerProps = {
  onSelect: (emoji: string) => void;
  onDragStart?: (emoji: string, e: React.DragEvent) => void;
};

const EMOJI_CATEGORIES = {
  "Faces": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓"],
  "Hands": ["👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃"],
  "Objects": ["⌚", "📱", "📲", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💾", "💿", "📷", "📸", "📹", "🎥", "📽", "🎞", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙", "🎚", "🎛", "⏱", "⏲", "⏰", "🕰", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯", "🧯", "🛢", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🛠", "🔧", "🔨", "⚒", "🛠", "⚙️", "🔩", "⚡", "🔥", "💧", "🌊"],
  "Symbols": ["✅", "❌", "⭐", "🌟", "💫", "✨", "💥", "💢", "💯", "💤", "💨", "🎯", "🎪", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", "🎲", "🎯", "🎳", "🎮", "🎰", "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩", "💺", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥", "🛳", "⛴", "🚢", "⚓", "⛽", "🚧", "🚦", "🚥", "🗺", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟", "🎡", "🎢", "🎠", "⛲", "⛱", "🏖", "🏝", "🏜", "🌋", "⛰", "🏔", "🗻", "🏕", "⛺", "🏠", "🏡", "🏘", "🏚", "🏗", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛", "⛪", "🕌", "🕍", "🕋", "⛩", "🛤", "🛣", "🗾", "🎑", "🏞", "🌅", "🌄", "🌠", "🎇", "🎆", "🌇", "🌆", "🏙", "🌃", "🌌", "🌉", "🌁"],
  "Flags": ["🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🏳️‍⚧️", "🇺🇳", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇷", "🇮🇴", "🇻🇬", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇰🇭", "🇨🇲", "🇨🇦", "🇮🇨", "🇨🇻", "🇧🇶", "🇰🇾", "🇨🇫", "🇹🇩", "🇨🇱", "🇨🇳", "🇨🇽", "🇨🇨", "🇨🇴", "🇰🇲", "🇨🇬", "🇨🇩", "🇨🇰", "🇨🇷", "🇨🇮", "🇭🇷", "🇨🇺", "🇨🇼", "🇨🇾", "🇨🇿", "🇩🇰", "🇩🇯", "🇩🇲", "🇩🇴", "🇪🇨", "🇪🇬", "🇸🇻", "🇬🇶", "🇪🇷", "🇪🇪", "🇪🇹", "🇪🇺", "🇫🇰", "🇫🇴", "🇫🇯", "🇫🇮", "🇫🇷", "🇬🇫", "🇵🇫", "🇹🇫", "🇬🇦", "🇬🇲", "🇬🇪", "🇩🇪", "🇬🇭", "🇬🇮", "🇬🇷", "🇬🇱", "🇬🇩", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇬", "🇬🇳", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇸", "🇮🇳", "🇮🇩", "🇮🇷", "🇮🇶", "🇮🇪", "🇮🇲", "🇮🇱", "🇮🇹", "🇯🇲", "🇯🇵", "🎌", "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇮", "🇽🇰", "🇰🇼", "🇰🇬", "🇱🇦", "🇱🇻", "🇱🇧", "🇱🇸", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹", "🇱🇺", "🇲🇴", "🇲🇰", "🇲🇬", "🇲🇼", "🇲🇾", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇭", "🇲🇶", "🇲🇷", "🇲🇺", "🇾🇹", "🇲🇽", "🇫🇲", "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇦", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇱", "🇳🇨", "🇳🇿", "🇳🇮", "🇳🇪", "🇳🇬", "🇳🇺", "🇳🇫", "🇰🇵", "🇲🇵", "🇳🇴", "🇴🇲", "🇵🇰", "🇵🇼", "🇵🇸", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇭", "🇵🇳", "🇵🇱", "🇵🇹", "🇵🇷", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇺", "🇷🇼", "🇼🇸", "🇸🇲", "🇸🇹", "🇸🇦", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇰", "🇸🇮", "🇬🇸", "🇸🇧", "🇸🇴", "🇿🇦", "🇰🇷", "🇸🇸", "🇪🇸", "🇱🇰", "🇧🇱", "🇸🇭", "🇰🇳", "🇱🇨", "🇵🇲", "🇻🇨", "🇸🇩", "🇸🇷", "🇸🇿", "🇸🇪", "🇨🇭", "🇸🇾", "🇹🇼", "🇹🇯", "🇹🇿", "🇹🇭", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴", "🇹🇹", "🇹🇳", "🇹🇷", "🇹🇲", "🇹🇨", "🇹🇻", "🇻🇮", "🇺🇬", "🇺🇦", "🇦🇪", "🇬🇧", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇦", "🇻🇪", "🇻🇳", "🇼🇫", "🇪🇭", "🇾🇪", "🇿🇲", "🇿🇼"],
};

const ICON_CATEGORIES = {
  "Social Media": [
    { name: "LinkedIn", icon: Linkedin, emoji: "💼" },
    { name: "GitHub", icon: Github, emoji: "💻" },
    { name: "Twitter", icon: Twitter, emoji: "🐦" },
    { name: "Facebook", icon: Facebook, emoji: "👥" },
    { name: "Instagram", icon: Instagram, emoji: "📷" },
    { name: "YouTube", icon: Youtube, emoji: "📺" },
    { name: "Globe", icon: Globe, emoji: "🌐" },
    { name: "Link", icon: Link, emoji: "🔗" },
    { name: "External Link", icon: ExternalLink, emoji: "↗️" },
  ],
  "Contact": [
    { name: "Mail", icon: Mail, emoji: "✉️" },
    { name: "Phone", icon: Phone, emoji: "📞" },
    { name: "Location", icon: MapPin, emoji: "📍" },
    { name: "Message", icon: MessageCircle, emoji: "💬" },
    { name: "Send", icon: Send, emoji: "📤" },
    { name: "Inbox", icon: Inbox, emoji: "📥" },
  ],
  "Professional": [
    { name: "Briefcase", icon: Briefcase, emoji: "💼" },
    { name: "Users", icon: Users, emoji: "👥" },
    { name: "User", icon: User, emoji: "👤" },
    { name: "User Circle", icon: UserCircle, emoji: "⭕" },
    { name: "Award", icon: Award, emoji: "🏆" },
    { name: "Trophy", icon: Trophy, emoji: "🏆" },
    { name: "Medal", icon: Medal, emoji: "🥇" },
    { name: "Star", icon: Star, emoji: "⭐" },
    { name: "Target", icon: Target, emoji: "🎯" },
    { name: "Trending Up", icon: TrendingUp, emoji: "📈" },
    { name: "Trending Down", icon: TrendingDown, emoji: "📉" },
    { name: "Activity", icon: Activity, emoji: "📊" },
  ],
  "Education": [
    { name: "Graduation Cap", icon: GraduationCap, emoji: "🎓" },
    { name: "School", icon: School, emoji: "🏫" },
    { name: "University", icon: University, emoji: "🎓" },
    { name: "Book", icon: Book, emoji: "📖" },
    { name: "Book Open", icon: BookOpen, emoji: "📚" },
    { name: "Library", icon: Library, emoji: "📚" },
    { name: "Notebook", icon: Notebook, emoji: "📓" },
    { name: "Bookmark", icon: Bookmark, emoji: "🔖" },
    { name: "Certificate", icon: Award, emoji: "📜" },
  ],
  "Technology": [
    { name: "Code", icon: Code, emoji: "💻" },
    { name: "Code 2", icon: Code2, emoji: "💻" },
    { name: "Terminal", icon: Terminal, emoji: "💻" },
    { name: "Database", icon: Database, emoji: "🗄️" },
    { name: "Server", icon: Server, emoji: "🖥️" },
    { name: "Cloud", icon: Cloud, emoji: "☁️" },
    { name: "Laptop", icon: Laptop, emoji: "💻" },
    { name: "Monitor", icon: Monitor, emoji: "🖥️" },
    { name: "Smartphone", icon: Smartphone, emoji: "📱" },
    { name: "Tablet", icon: Tablet, emoji: "📱" },
    { name: "CPU", icon: Cpu, emoji: "⚙️" },
    { name: "Hard Drive", icon: HardDrive, emoji: "💾" },
    { name: "Wifi", icon: Wifi, emoji: "📶" },
    { name: "Shield", icon: Shield, emoji: "🛡️" },
    { name: "Lock", icon: Lock, emoji: "🔒" },
    { name: "Key", icon: Key, emoji: "🔑" },
    { name: "Git Branch", icon: GitBranch, emoji: "🌿" },
    { name: "Git Commit", icon: GitCommit, emoji: "💾" },
    { name: "Git Merge", icon: GitMerge, emoji: "🔀" },
    { name: "Git Pull Request", icon: GitPullRequest, emoji: "🔀" },
  ],
  "Business": [
    { name: "Building", icon: Building, emoji: "🏢" },
    { name: "Building 2", icon: Building2, emoji: "🏢" },
    { name: "Factory", icon: Factory, emoji: "🏭" },
    { name: "Store", icon: Store, emoji: "🏪" },
    { name: "Warehouse", icon: Warehouse, emoji: "🏭" },
    { name: "Dollar", icon: DollarSign, emoji: "💵" },
    { name: "Percent", icon: Percent, emoji: "%" },
    { name: "Credit Card", icon: CreditCard, emoji: "💳" },
    { name: "Wallet", icon: Wallet, emoji: "👛" },
    { name: "Receipt", icon: Receipt, emoji: "🧾" },
    { name: "Bar Chart", icon: BarChart, emoji: "📊" },
    { name: "Line Chart", icon: LineChart, emoji: "📈" },
    { name: "Pie Chart", icon: PieChart, emoji: "🥧" },
  ],
  "Time & Date": [
    { name: "Calendar", icon: Calendar, emoji: "📅" },
    { name: "Clock", icon: Clock, emoji: "⏰" },
    { name: "Timer", icon: Clock, emoji: "⏱️" },
  ],
  "Media": [
    { name: "Camera", icon: Camera, emoji: "📷" },
    { name: "Video", icon: Video, emoji: "🎥" },
    { name: "Film", icon: Film, emoji: "🎬" },
    { name: "Image", icon: Image, emoji: "🖼️" },
    { name: "Mic", icon: Mic, emoji: "🎤" },
    { name: "Headphones", icon: Headphones, emoji: "🎧" },
    { name: "Music", icon: Music, emoji: "🎵" },
    { name: "Play", icon: Play, emoji: "▶️" },
    { name: "Pause", icon: Pause, emoji: "⏸️" },
  ],
  "Files & Documents": [
    { name: "File", icon: File, emoji: "📄" },
    { name: "File Text", icon: FileText, emoji: "📄" },
    { name: "File Code", icon: FileCode, emoji: "💻" },
    { name: "File Check", icon: FileCheck, emoji: "✅" },
    { name: "File Edit", icon: FileEdit, emoji: "✏️" },
    { name: "File Search", icon: FileSearch, emoji: "🔍" },
    { name: "Folder", icon: Folder, emoji: "📁" },
    { name: "Folder Open", icon: FolderOpen, emoji: "📂" },
    { name: "Download", icon: Download, emoji: "⬇️" },
    { name: "Upload", icon: Upload, emoji: "⬆️" },
    { name: "Save", icon: Save, emoji: "💾" },
  ],
  "Arrows & Navigation": [
    { name: "Right", icon: ArrowRight, emoji: "→" },
    { name: "Left", icon: ArrowLeft, emoji: "←" },
    { name: "Up", icon: ArrowUp, emoji: "↑" },
    { name: "Down", icon: ArrowDown, emoji: "↓" },
    { name: "Chevron Right", icon: ChevronRight, emoji: "›" },
    { name: "Chevron Left", icon: ChevronLeft, emoji: "‹" },
    { name: "Chevron Up", icon: ChevronUp, emoji: "⌃" },
    { name: "Chevron Down", icon: ChevronDown, emoji: "⌄" },
  ],
  "Common": [
    { name: "Check", icon: CheckCircle, emoji: "✓" },
    { name: "Cross", icon: XCircle, emoji: "✗" },
    { name: "Plus", icon: Plus, emoji: "+" },
    { name: "Minus", icon: Minus, emoji: "-" },
    { name: "X", icon: X, emoji: "✕" },
    { name: "Check", icon: Check, emoji: "✓" },
    { name: "Alert", icon: AlertCircle, emoji: "⚠️" },
    { name: "Info", icon: Info, emoji: "ℹ️" },
    { name: "Zap", icon: Zap, emoji: "⚡" },
    { name: "Heart", icon: Heart, emoji: "❤️" },
    { name: "Star", icon: Star, emoji: "⭐" },
    { name: "Search", icon: Search, emoji: "🔍" },
    { name: "Settings", icon: Settings, emoji: "⚙️" },
    { name: "Edit", icon: Edit, emoji: "✏️" },
    { name: "Trash", icon: Trash2, emoji: "🗑️" },
  ],
};

export function EmojiIconPicker({ onSelect, onDragStart }: EmojiIconPickerProps) {
  const [activeTab, setActiveTab] = useState<"emojis" | "icons">("emojis");
  const [activeCategory, setActiveCategory] = useState<string>("Faces");

  const handleDragStart = (item: string, e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "emoji", value: item }));
    if (onDragStart) {
      onDragStart(item, e);
    }
  };

  const handleIconDragStart = (emoji: string, e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "emoji", value: emoji }));
    if (onDragStart) {
      onDragStart(emoji, e);
    }
  };

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("emojis")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "emojis"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Smile size={14} className="inline mr-1" />
          Emojis
        </button>
        <button
          onClick={() => setActiveTab("icons")}
          className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "icons"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Star size={14} className="inline mr-1" />
          Icons
        </button>
      </div>

      {/* Emoji Picker */}
      {activeTab === "emojis" && (
        <>
          {/* Category Selector */}
          <div className="flex gap-1 flex-wrap">
            {Object.keys(EMOJI_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES]?.map((emoji, idx) => (
              <button
                key={`${activeCategory}-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(emoji, e)}
                onClick={() => onSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Icon Picker */}
      {activeTab === "icons" && (
        <>
          {/* Category Selector */}
          <div className="flex gap-1 flex-wrap">
            {Object.keys(ICON_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Icon Grid */}
          <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
            {ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES]?.map((item, idx) => {
              const IconComponent = item.icon;
              // Skip if icon is undefined
              if (!IconComponent) {
                return null;
              }
              return (
                <button
                  key={`${activeCategory}-${idx}`}
                  draggable
                  onDragStart={(e) => handleIconDragStart(item.emoji, e)}
                  onClick={() => onSelect(item.emoji)}
                  className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded border border-gray-200 cursor-grab active:cursor-grabbing transition-colors"
                  title={item.name}
                >
                  <IconComponent size={20} className="text-gray-700" />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
