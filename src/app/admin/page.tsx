"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SEED_ADMIN_AND_STAFF,
  SEED_MODERATION_QUEUE,
  StaffUser,
  ModerationItem,
} from "@/modules/admin/data";
import { Job, Employer, ApplicationSubmission } from "@/modules/jobs/types";
import { JobFeed, FeedSyncLog } from "@/modules/feeds/types";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Terminal,
  ExternalLink,
  Search,
  BookOpen,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Filter,
  Check,
  Rss,
  Building,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Menu,
  X,
  UserPlus,
  Sun,
  Moon
} from "lucide-react";
import { formatCurrency, formatDateRelative, buildWhatsAppUrl } from "@/lib/utils";

type AdminTab = "JOBS" | "EMPLOYERS" | "FEEDS" | "APPLICANTS" | "QUEUE" | "STAFF" | "SYSTEM";

export default function AdminPortalPage() {
  // Mobile Left Sidebar State
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Theme State (Dark / Light Mode Toggle)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("jobeelanka-theme") : null;
    if (saved === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jobeelanka-theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jobeelanka-theme", "dark");
      setIsDarkMode(true);
    }
  };

  // Admin Authentication & Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  } | null>(null);

  const [currentUser, setCurrentUser] = useState<StaffUser>(SEED_ADMIN_AND_STAFF[0]);
  const [activeTab, setActiveTab] = useState<AdminTab>("JOBS");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Staff Management State
  const [staffList, setStaffList] = useState<StaffUser[]>(SEED_ADMIN_AND_STAFF);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    email: "",
    role: "MODERATOR_STAFF" as StaffUser["role"],
    department: "Job Moderation & Quality Assurance",
    permissions: [
      "REVIEW_VACANCIES",
      "APPROVE_JOBS",
      "REJECT_JOBS",
      "EDIT_TAXONOMY",
      "TRIAGE_REPORTS",
    ],
  });

  // Data Stores
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [feeds, setFeeds] = useState<JobFeed[]>([]);
  const [syncLogs, setSyncLogs] = useState<FeedSyncLog[]>([]);
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [queue, setQueue] = useState<ModerationItem[]>(SEED_MODERATION_QUEUE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchInput, setTempSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isSyncingFeedId, setIsSyncingFeedId] = useState<string | null>(null);

  // Table Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Database Sync State
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  // CSV Import Modal state
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvInputText, setCsvInputText] = useState("");
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);
  const [isImportingCsv, setIsImportingCsv] = useState(false);

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState<Partial<Employer> | null>(null);

  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [newFeedData, setNewFeedData] = useState({
    name: "",
    url: "",
    category: "Information Technology",
    district: "Colombo",
    autoSyncIntervalMinutes: 60,
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Authentication Check on Mount
  const checkAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const res = await fetch("/api/v1/auth/admin");
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated && json.user) {
          setIsAuthenticated(true);
          setAuthenticatedAdmin(json.user);
          const found = SEED_ADMIN_AND_STAFF.find(
            (u) => u.email.toLowerCase() === json.user.email.toLowerCase()
          );
          if (found) setCurrentUser(found);
          loadAllData();
          return;
        }
      }
      setIsAuthenticated(false);
      setAuthenticatedAdmin(null);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);
    try {
      const res = await fetch("/api/v1/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(data.error || "Authentication failed. Check admin credentials.");
        setIsSubmittingLogin(false);
        return;
      }

      setIsAuthenticated(true);
      setAuthenticatedAdmin(data.user);
      const found = SEED_ADMIN_AND_STAFF.find(
        (u) => u.email.toLowerCase() === data.user.email.toLowerCase()
      );
      if (found) setCurrentUser(found);
      showToast(`Welcome, Super Admin ${data.user.name}`);
      loadAllData();
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/admin", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
      setAuthenticatedAdmin(null);
      setLoginPassword("");
      showToast("Signed out of governance session.");
    }
  };

  // Staff CRUD Handlers
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffData.name || !newStaffData.email) {
      showToast("Name and email are required", "error");
      return;
    }

    setIsSubmittingStaff(true);
    try {
      const res = await fetch("/api/v1/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaffData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to create staff member", "error");
        return;
      }
      setStaffList(data.list);
      showToast(`Staff member "${data.data.name}" added successfully!`, "success");
      setIsStaffModalOpen(false);
      setNewStaffData({
        name: "",
        email: "",
        role: "MODERATOR_STAFF",
        department: "Job Moderation & Quality Assurance",
        permissions: [
          "REVIEW_VACANCIES",
          "APPROVE_JOBS",
          "REJECT_JOBS",
          "EDIT_TAXONOMY",
          "TRIAGE_REPORTS",
        ],
      });
    } catch {
      showToast("Network error creating staff member", "error");
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!confirm(`Are you sure you want to remove staff member "${staffName}"?`)) return;

    try {
      const res = await fetch(`/api/v1/admin/staff?id=${staffId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to remove staff member", "error");
        return;
      }
      setStaffList(data.list);
      showToast(`Staff member "${staffName}" removed.`, "success");
    } catch {
      showToast("Network error removing staff member", "error");
    }
  };

  const handleSyncDatabase = async () => {
    setIsSyncingDb(true);
    try {
      const res = await fetch("/api/v1/admin/sync-db", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Supabase database credentials needed in environment", "error");
      } else {
        showToast(data.message || "Database synchronized successfully!", "success");
        loadAllData();
      }
    } catch {
      showToast("Network connection error during database sync", "error");
    } finally {
      setIsSyncingDb(false);
    }
  };

  // Fetch all initial data
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [jobsRes, empsRes, feedsRes, appsRes, staffRes] = await Promise.all([
        fetch("/api/v1/jobs?includeInactive=true").then((r) => r.json()),
        fetch("/api/v1/employers").then((r) => r.json()),
        fetch("/api/v1/feeds").then((r) => r.json()),
        fetch("/api/v1/applications").then((r) => r.json()),
        fetch("/api/v1/admin/staff").then((r) => r.json()).catch(() => ({ data: SEED_ADMIN_AND_STAFF })),
      ]);

      if (jobsRes.data) setJobs(jobsRes.data);
      if (empsRes.data) setEmployers(empsRes.data);
      if (feedsRes.data?.feeds) setFeeds(feedsRes.data.feeds);
      if (feedsRes.data?.logs) setSyncLogs(feedsRes.data.logs);
      if (appsRes.data) setApplications(appsRes.data);
      if (staffRes.data) setStaffList(staffRes.data);
      const moderationRes = await fetch("/api/v1/moderation").then((r) => r.json()).catch(() => ({ data: [] }));
      if (moderationRes.data) {
        setQueue((prev) => [
          ...moderationRes.data,
          ...prev.filter((item) => !String(item.id).startsWith("job-")),
        ]);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // JOBS CRUD ACTIONS
  // ==========================================
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob?.title) return;

    try {
      if (editingJob.id) {
        // Update existing job
        const res = await fetch(`/api/v1/jobs/${editingJob.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingJob),
        });
        const result = await res.json();
        if (result.success) {
          setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? result.data : j)));
          showToast(`Job "${result.data.title}" updated successfully!`);
        }
      } else {
        // Create new job
        const res = await fetch("/api/v1/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingJob),
        });
        const result = await res.json();
        if (result.success) {
          setJobs((prev) => [result.data, ...prev]);
          showToast(`New vacancy "${result.data.title}" published!`);
        }
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
    } catch (err) {
      showToast("Failed to save job vacancy", "error");
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/v1/jobs/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        showToast(`Job "${title}" deleted successfully.`);
      }
    } catch (err) {
      showToast("Error deleting job", "error");
    }
  };

  const handleToggleJobFeatured = async (job: Job) => {
    try {
      const res = await fetch(`/api/v1/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !job.featured }),
      });
      const result = await res.json();
      if (result.success) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? result.data : j)));
        showToast(result.data.featured ? `Featured status enabled for ${job.title}` : `Removed from featured`);
      }
    } catch (e) {
      showToast("Could not update featured status", "error");
    }
  };

  const handleToggleJobStatus = async (job: Job) => {
    const newStatus = job.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    try {
      const res = await fetch(`/api/v1/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
        );
        showToast(`Vacancy ${job.code || job.title} set to ${newStatus}`);
      }
    } catch (e) {
      showToast("Could not toggle status", "error");
    }
  };

  const handleToggleContactChannel = async (
    job: Job,
    channel: "showWhatsApp" | "showEmail" | "showPhone"
  ) => {
    const nextVal = !Boolean(job[channel]);
    try {
      const res = await fetch(`/api/v1/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [channel]: nextVal }),
      });
      const result = await res.json();
      if (result.success) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, [channel]: nextVal } : j))
        );
        const label = channel === "showWhatsApp" ? "WhatsApp" : channel === "showEmail" ? "Email" : "Phone Call";
        showToast(`${label} vector turned ${nextVal ? "ON" : "OFF"}`);
      }
    } catch (e) {
      showToast("Could not update direct contact toggle", "error");
    }
  };

  const handleBulkStatus = async (status: "ACTIVE" | "INACTIVE") => {
    try {
      const promises = filteredJobs.map((j) =>
        fetch(`/api/v1/jobs/${j.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      );
      await Promise.all(promises);
      const targetIds = new Set(filteredJobs.map((j) => j.id));
      setJobs((prev) =>
        prev.map((j) => (targetIds.has(j.id) ? { ...j, status } : j))
      );
      showToast(`Set ${filteredJobs.length} visible listings to ${status}`);
    } catch (e) {
      showToast("Failed to update bulk status", "error");
    }
  };

  const handleExportCsv = () => {
    window.open("/api/v1/jobs/csv", "_blank");
    showToast("Downloading full directory CSV export...");
  };

  const handleDownloadCsvTemplate = () => {
    window.open("/api/v1/jobs/csv?template=true", "_blank");
    showToast("Downloading CSV Template...");
  };

  const handleImportCsvSubmit = async () => {
    if (!csvInputText || !csvInputText.trim()) {
      setCsvFeedback("Please paste or upload CSV text first.");
      return;
    }

    setIsImportingCsv(true);
    setCsvFeedback(null);
    try {
      const res = await fetch("/api/v1/jobs/csv", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: csvInputText,
      });
      const result = await res.json();
      if (result.success) {
        showToast(`Successfully imported ${result.importedCount} vacancies!`);
        if (result.jobs) {
          setJobs(result.jobs);
        } else {
          loadAllData();
        }
        setIsCsvModalOpen(false);
        setCsvInputText("");
      } else {
        setCsvFeedback(result.error || "Failed to import CSV.");
      }
    } catch (e) {
      setCsvFeedback("Network error or invalid CSV format.");
    } finally {
      setIsImportingCsv(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvInputText(content || "");
      setCsvFeedback(`Loaded file: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsText(file);
  };

  // ==========================================
  // EMPLOYERS CRUD ACTIONS
  // ==========================================
  const handleSaveEmployer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployer?.displayName) return;

    try {
      if (editingEmployer.id) {
        const res = await fetch(`/api/v1/employers/${editingEmployer.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEmployer),
        });
        const result = await res.json();
        if (result.success) {
          setEmployers((prev) => prev.map((e) => (e.id === editingEmployer.id ? result.data : e)));
          showToast(`Employer "${result.data.displayName}" updated!`);
        }
      } else {
        const res = await fetch("/api/v1/employers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEmployer),
        });
        const result = await res.json();
        if (result.success) {
          setEmployers((prev) => [...prev, result.data]);
          showToast(`Employer "${result.data.displayName}" registered!`);
        }
      }
      setIsEmployerModalOpen(false);
      setEditingEmployer(null);
    } catch (e) {
      showToast("Failed to save employer", "error");
    }
  };

  const handleDeleteEmployer = async (id: string, name: string) => {
    if (!confirm(`Delete employer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/employers/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setEmployers((prev) => prev.filter((e) => e.id !== id));
        showToast(`Employer "${name}" deleted.`);
      }
    } catch (e) {
      showToast("Error deleting employer", "error");
    }
  };

  // ==========================================
  // RSS FEEDS & LEAD INGESTION ACTIONS
  // ==========================================
  const handleSyncFeedNow = async (feedId: string, feedName: string) => {
    setIsSyncingFeedId(feedId);
    try {
      const res = await fetch("/api/v1/feeds/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedId }),
      });
      const result = await res.json();
      if (result.success) {
        showToast(`⚡ Synchronized ${result.data.syncedItemsCount} job leads from ${feedName}!`);
        loadAllData();
      } else {
        showToast(result.error || "Sync failed", "error");
      }
    } catch (e) {
      showToast("Network error syncing feed", "error");
    } finally {
      setIsSyncingFeedId(null);
    }
  };

  const handleCreateFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedData.name || !newFeedData.url) return;

    try {
      const res = await fetch("/api/v1/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedData),
      });
      const result = await res.json();
      if (result.success) {
        setFeeds((prev) => [result.data, ...prev]);
        showToast(`Feed lead source "${result.data.name}" added successfully!`);
        setIsFeedModalOpen(false);
        setNewFeedData({
          name: "",
          url: "",
          category: "Information Technology",
          district: "Colombo",
          autoSyncIntervalMinutes: 60,
        });
      }
    } catch (e) {
      showToast("Failed to create feed lead source", "error");
    }
  };

  const handleDeleteFeed = async (id: string, name: string) => {
    if (!confirm(`Remove RSS lead source "${name}"?`)) return;
    try {
      const res = await fetch(`/api/v1/feeds/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setFeeds((prev) => prev.filter((f) => f.id !== id));
        showToast(`Feed "${name}" removed.`);
      }
    } catch (e) {
      showToast("Failed to delete feed", "error");
    }
  };

  const handleModerateImportedJob = async (item: ModerationItem, decision: "APPROVE" | "REJECT") => {
    const jobId = (item as ModerationItem & { jobId?: string }).jobId;
    if (!jobId) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: decision === "APPROVE" ? "APPROVED" : "FLAGGED" } : q)));
      return;
    }
    try {
      const res = await fetch("/api/v1/moderation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, decision }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        showToast(result.error || "Moderation update failed", "error");
        return;
      }
      setQueue((prev) => prev.filter((q) => q.id !== item.id));
      showToast(decision === "APPROVE" ? `Approved "${item.entityName}" for publication.` : `Rejected and blocked "${item.entityName}".`);
    } catch {
      showToast("Network error updating moderation decision", "error");
    }
  };

  // ==========================================
  // APPLICANTS CRM ACTIONS
  // ==========================================
  const handleUpdateApplicationStatus = async (
    id: string,
    status: ApplicationSubmission["status"]
  ) => {
    try {
      const res = await fetch(`/api/v1/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
        showToast(`Candidate status updated to ${status}`);
      }
    } catch (e) {
      showToast("Failed to update status", "error");
    }
  };

  const handleExportApplicantsCSV = () => {
    const headers = ["ID,Candidate Name,Email,Phone,Job ID,Status,Created At,PDPA Consent"];
    const rows = applications.map((a) =>
      `"${a.id}","${a.candidateName}","${a.candidateEmail}","${a.candidatePhone}","${a.jobId}","${a.status}","${a.createdAt}","${a.pdpaConsentGiven}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lanka_careers_applicants_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Applicants CSV export downloaded!");
  };

  // Dynamic categories and customers extracted from current jobs
  const availableCategories = Array.from(
    new Set(jobs.map((j) => j.industry).filter(Boolean))
  );
  const availableCustomers = Array.from(
    new Set(jobs.map((j) => j.employer.displayName).filter(Boolean))
  );

  // Filtered views
  const filteredJobs = jobs.filter((j) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      j.title.toLowerCase().includes(q) ||
      (j.code && j.code.toLowerCase().includes(q)) ||
      j.employer.displayName.toLowerCase().includes(q) ||
      j.city.toLowerCase().includes(q) ||
      j.district.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "ALL" || j.industry === selectedCategory;

    const matchesCustomer =
      selectedCustomer === "ALL" ||
      j.employer.displayName.toLowerCase() === selectedCustomer.toLowerCase();

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && j.status !== "INACTIVE") ||
      (statusFilter === "INACTIVE" && j.status === "INACTIVE");

    return matchesSearch && matchesCategory && matchesCustomer && matchesStatus;
  });

  const filteredEmployers = employers.filter(
    (e) =>
      e.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Verifying Governance Access...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 text-white">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-7 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">JobeeLanka Back-Office</h1>
            <p className="text-xs text-slate-400">
              Restricted governance cockpit for authorized administrators.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="contactrajeevan@hotmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-emerald-500 focus:outline-none transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{isSubmittingLogin ? "Authenticating..." : "Sign In to Cockpit"}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold text-white transition-all transform animate-bounce ${
            notification.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Mobile Top Navigation Bar with Drawer Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight">JobeeLanka</span>
            <span className="ml-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 px-1 py-0.2 rounded border border-emerald-800/40">
              ADMIN
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle admin sidebar"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* =========================================================================
          LEFT SIDEBAR (DESKTOP FIXED/STICKY + MOBILE DRAWER)
      ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-out md:static md:translate-x-0 shrink-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>JobeeLanka</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  COCKPIT
                </span>
              </div>
              <div className="text-[11px] text-slate-400">Governance & Directory</div>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Section: DIRECTORY CATALOGS */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Catalogs & Ingestion
            </div>

            <button
              onClick={() => { setActiveTab("JOBS"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "JOBS"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Jobs Directory</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "JOBS" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("EMPLOYERS"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "EMPLOYERS"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4" />
                <span>Employers</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "EMPLOYERS" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {employers.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("FEEDS"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "FEEDS"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Rss className="w-4 h-4 text-amber-400" />
                <span>RSS & Lead Ingestion</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "FEEDS" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {feeds.length}
              </span>
            </button>
          </div>

          {/* Section: OPERATIONS & CANDIDATES */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Operations & Triage
            </div>

            <button
              onClick={() => { setActiveTab("APPLICANTS"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "APPLICANTS"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Referrals CRM</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "APPLICANTS" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("QUEUE"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "QUEUE"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Moderation Queue</span>
              </div>
              {queue.filter((q) => q.status === "PENDING" || q.status === "FLAGGED").length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {queue.filter((q) => q.status === "PENDING" || q.status === "FLAGGED").length}
                </span>
              )}
            </button>
          </div>

          {/* Section: GOVERNANCE & TELEMETRY */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Governance & Admin
            </div>

            <button
              onClick={() => { setActiveTab("STAFF"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "STAFF"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Staff & Roles</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "STAFF" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {staffList.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("SYSTEM"); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "SYSTEM"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>System Telemetry</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <Link
              href="/swagger"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Swagger API Spec</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Sidebar Footer: Super Admin Profile & Exit */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              {(authenticatedAdmin?.name || currentUser.name).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                <span>{authenticatedAdmin?.name || currentUser.name}</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1 py-0.2 rounded font-bold">
                  SUPER
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {authenticatedAdmin?.email || currentUser.email}
              </div>
            </div>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark / Light Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 text-[11px] font-semibold text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Directory</span>
          </Link>
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* =========================================================================
          MAIN CONTENT CANVAS (RIGHT)
      ========================================================================= */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        {/* Top Header Bar for Active View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Cockpit</span>
              <span>/</span>
              <span className="text-emerald-600 font-bold capitalize">
                {activeTab.toLowerCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeTab === "JOBS" && "Curated Vacancy Catalog"}
              {activeTab === "EMPLOYERS" && "Verified Employers & KYC"}
              {activeTab === "FEEDS" && "RSS Syndication & Lead Ingestion"}
              {activeTab === "APPLICANTS" && "Candidate Referral Pipeline"}
              {activeTab === "QUEUE" && "Quality & Moderation Queue"}
              {activeTab === "STAFF" && "Staff Roles & Governance"}
              {activeTab === "SYSTEM" && "Telemetry & System Infrastructure"}
            </h1>
          </div>

          {/* Contextual Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === "JOBS" && (
              <>
                <button
                  onClick={() => setIsCsvModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Import CSV
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    setEditingJob({
                      listingType: "vacancy",
                      workMode: "HYBRID",
                      city: "Colombo",
                      district: "Colombo",
                      industry: "Information Technology",
                      showWhatsApp: false,
                      showEmail: false,
                      showPhone: false,
                    });
                    setIsJobModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Job</span>
                </button>
              </>
            )}

            {activeTab === "EMPLOYERS" && (
              <button
                onClick={() => {
                  setEditingEmployer({
                    verificationStatus: "VERIFIED_BUSINESS",
                    district: "Colombo",
                  });
                  setIsEmployerModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register Employer</span>
              </button>
            )}

            {activeTab === "FEEDS" && (
              <>
                <button
                  onClick={() => {
                    if (feeds.length > 0) handleSyncFeedNow(feeds[0].id, feeds[0].name);
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Feeds</span>
                </button>
                <button
                  onClick={() => setIsFeedModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Feed</span>
                </button>
              </>
            )}

            {activeTab === "STAFF" && (
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member</span>
              </button>
            )}
          </div>
        </div>

        {/* 6-Metric Bento Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Listings</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {jobs.length.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Across 25 Districts</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active (ON)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {jobs.filter((j) => (j.status || "ACTIVE") === "ACTIVE").length.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Live in Directory</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Inactive (OFF)</span>
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-500 dark:text-slate-400">
              {jobs.filter((j) => j.status === "INACTIVE").length.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Draft / Archived</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp Lines</span>
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {jobs.filter((j) => j.showWhatsApp).length.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Direct Chat Enabled</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">HR Inboxes</span>
              <Mail className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {jobs.filter((j) => j.showEmail).length.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-500">Direct Apply Email</div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Categories</span>
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {new Set(jobs.map((j) => j.industry)).size}
            </div>
            <div className="text-[10px] text-slate-500">Indexed Sectors</div>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: JOBS DIRECTORY BACK-OFFICE (MATCHING LEGACY BACK-OFFICE IMAGE 1)
        ========================================================================= */}
        {activeTab === "JOBS" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            {/* Header & Title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <span>View Jobs</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curated vacancy catalog matching legacy back-office. Toggle listings ON/OFF, manage direct channels, or import/export via CSV.
                </p>
              </div>

              {/* Action Buttons: CSV & Add Job */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  title="Export active & inactive jobs to RFC 4180 CSV"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export to CSV</span>
                </button>

                <button
                  onClick={() => {
                    setCsvInputText("");
                    setCsvFeedback(null);
                    setIsCsvModalOpen(true);
                  }}
                  title="Upload or paste CSV to bulk import jobs"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Import CSV</span>
                </button>

                <button
                  onClick={handleDownloadCsvTemplate}
                  title="Download standard CSV spreadsheet template"
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>CSV Template</span>
                </button>

                <button
                  onClick={() => {
                    setEditingJob({
                      title: "",
                      code: `JL${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                      district: "Colombo",
                      city: "Colombo",
                      industry: "Information Technology",
                      workMode: "HYBRID",
                      employmentType: "FULL_TIME",
                      salaryMin: 350000,
                      salaryMax: 550000,
                      salaryCurrency: "LKR",
                      status: "ACTIVE",
                      showWhatsApp: false,
                      showEmail: false,
                      showPhone: false,
                      shortSnippet: "",
                      requiredSkills: ["Communication", "Problem Solving"],
                      applicationUrl: "https://",
                    });
                    setIsJobModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Job</span>
                </button>
              </div>
            </div>

            {/* Filter Toolbar (Replicating Image 1: Search, On/Off, Category, Customer) */}
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search input with Search and Reset buttons */}
                <div className="flex items-center gap-1.5 flex-1 min-w-[260px]">
                  <input
                    type="text"
                    placeholder="Search for..."
                    value={tempSearchInput}
                    onChange={(e) => setTempSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setSearchQuery(tempSearchInput);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => {
                      setSearchQuery(tempSearchInput);
                      setCurrentPage(1);
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                  >
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setTempSearchInput("");
                      setSearchQuery("");
                      setSelectedCategory("ALL");
                      setSelectedCustomer("ALL");
                      setStatusFilter("ALL");
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Bulk Status Toggles [Reset] [On] [Off] */}
                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Bulk:</span>
                  <button
                    onClick={() => handleBulkStatus("ACTIVE")}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                    title="Turn all visible listings ON"
                  >
                    On
                  </button>
                  <button
                    onClick={() => handleBulkStatus("INACTIVE")}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-600 hover:bg-slate-700 text-white shadow-xs"
                    title="Turn all visible listings OFF"
                  >
                    Off
                  </button>
                </div>

                {/* Category Filter Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">Filter By Category (All)</option>
                  <option value="INGO's in Sri Lanka">INGO&apos;s in Sri Lanka</option>
                  <option value="UN Missions in Sri Lanka">UN Missions in Sri Lanka</option>
                  <option value="UN & INGO World wide Job Sites">UN & INGO World wide Job Sites</option>
                  <option value="Finance Company Sites">Finance Company Sites</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Apparel & Manufacturing">Apparel & Manufacturing</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                  <option value="Overseas Careers (SLBFE Verified)">Overseas Careers</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                {/* Customer (Employer) Filter Dropdown */}
                <select
                  value={selectedCustomer}
                  onChange={(e) => {
                    setSelectedCustomer(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">Filter By Customer (All)</option>
                  {availableCustomers.map((cust) => (
                    <option key={cust} value={cust}>
                      {cust}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Status: ON only</option>
                  <option value="INACTIVE">Status: OFF only</option>
                </select>

                <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span>Page size:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>

              {/* Status indicator bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div>
                  Showing <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> of{" "}
                  {jobs.length} jobs (
                  <span className="text-emerald-600 font-bold">
                    {jobs.filter((j) => j.status !== "INACTIVE").length} ON
                  </span>
                  ,{" "}
                  <span className="text-slate-400 font-semibold">
                    {jobs.filter((j) => j.status === "INACTIVE").length} OFF
                  </span>
                  )
                </div>
                {(searchQuery || selectedCategory !== "ALL" || selectedCustomer !== "ALL" || statusFilter !== "ALL") && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
                    <span>Active Filters:</span>
                    {searchQuery && <span className="bg-amber-100 px-1.5 py-0.5 rounded">Query: &quot;{searchQuery}&quot;</span>}
                    {selectedCategory !== "ALL" && <span className="bg-amber-100 px-1.5 py-0.5 rounded">{selectedCategory}</span>}
                    {selectedCustomer !== "ALL" && <span className="bg-amber-100 px-1.5 py-0.5 rounded">{selectedCustomer}</span>}
                    {statusFilter !== "ALL" && <span className="bg-amber-100 px-1.5 py-0.5 rounded">{statusFilter}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Jobs Table (Matching Image 1 with sticky header and max height) */}
            {(() => {
              const totalPages = Math.ceil(filteredJobs.length / pageSize) || 1;
              const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

              return (
                <>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[640px] overflow-y-auto scrollbar-thin shadow-xs">
                    <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                      <thead className="sticky top-0 z-10 bg-slate-100/95 dark:bg-slate-800/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] shadow-xs">
                        <tr>
                          <th className="py-2.5 px-3 w-14 text-center">Image</th>
                          <th className="py-2.5 px-3 min-w-[280px]">Title</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Code</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Category</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">City</th>
                          <th className="py-2.5 px-3 text-center whitespace-nowrap">Views</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">Added</th>
                          <th className="py-2.5 px-3 text-center whitespace-nowrap">Status</th>
                          <th className="py-2.5 px-3 text-center whitespace-nowrap">Direct Channels</th>
                          <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                        {paginatedJobs.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-12 text-center text-slate-400">
                              No vacancies match your filter criteria. Click &quot;Reset&quot; to restore all items.
                            </td>
                          </tr>
                        ) : (
                          paginatedJobs.map((job) => {
                            const destinationUrl =
                              job.applicationUrl || job.applyUrl || job.sourceUrl || job.employer.website;
                            const isStatusOn = job.status !== "INACTIVE";

                            return (
                              <tr
                                key={job.id}
                                className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/40 transition-colors ${
                                  !isStatusOn ? "opacity-60 bg-slate-50/40 dark:bg-slate-950/30" : ""
                                }`}
                              >
                                {/* Image */}
                                <td className="py-2.5 px-3 text-center">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden mx-auto flex items-center justify-center p-0.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={job.employer.logo}
                                      alt={job.employer.displayName}
                                      className="w-full h-full object-contain rounded-lg"
                                    />
                                  </div>
                                </td>

                                {/* Title */}
                                <td className="py-2.5 px-3 max-w-xs">
                                  <div className="font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                                    {destinationUrl ? (
                                      <a
                                        href={destinationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-emerald-600 hover:underline inline-flex items-center gap-1"
                                        title={`Click to open destination: ${destinationUrl}`}
                                      >
                                        <span>{job.title}</span>
                                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 inline" />
                                      </a>
                                    ) : (
                                      <span>{job.title}</span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                    {job.employer.displayName}
                                  </div>
                                </td>

                                {/* Code */}
                                <td className="py-2.5 px-3 whitespace-nowrap">
                                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                                    {job.code || "110B0PNNQ1R"}
                                  </span>
                                </td>

                                {/* Category */}
                                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                                    {job.industry}
                                  </span>
                                </td>

                                {/* City */}
                                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                  {job.city || job.district || "Any part of Sri Lanka"}
                                </td>

                                {/* Views */}
                                <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                                  {job.viewsCount || 0}
                                </td>

                                {/* Added Date */}
                                <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                                  {job.datePosted ? job.datePosted.replace("T", " ").slice(0, 19) : "2020-12-14 00:40:31"}
                                </td>

                                {/* Status (iOS ON/OFF toggle switch) */}
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isStatusOn}
                                    onClick={() => handleToggleJobStatus(job)}
                                    title={isStatusOn ? "Click to turn OFF" : "Click to turn ON"}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                      isStatusOn ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        isStatusOn ? "translate-x-5" : "translate-x-0"
                                      }`}
                                    />
                                  </button>
                                </td>

                                {/* Direct Channels (Hidden by default, toggleable per job) */}
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => handleToggleContactChannel(job, "showWhatsApp")}
                                      title={`WhatsApp: ${job.showWhatsApp ? "ON (shown on cards)" : "OFF (hidden)"}`}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                        job.showWhatsApp
                                          ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                                          : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500"
                                      }`}
                                    >
                                      WA
                                    </button>
                                    <button
                                      onClick={() => handleToggleContactChannel(job, "showEmail")}
                                      title={`Email: ${job.showEmail ? "ON (shown on cards)" : "OFF (hidden)"}`}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                        job.showEmail
                                          ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
                                          : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500"
                                      }`}
                                    >
                                      Mail
                                    </button>
                                    <button
                                      onClick={() => handleToggleContactChannel(job, "showPhone")}
                                      title={`Phone: ${job.showPhone ? "ON (shown on cards)" : "OFF (hidden)"}`}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                        job.showPhone
                                          ? "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300"
                                          : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500"
                                      }`}
                                    >
                                      Tel
                                    </button>
                                  </div>
                                </td>

                                {/* Actions (Blue circular edit button matching Image 1) */}
                                <td className="py-2.5 px-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Blue Edit Button matching legacy UI */}
                                    <button
                                      onClick={() => {
                                        setEditingJob(job);
                                        setIsJobModalOpen(true);
                                      }}
                                      title="Edit Job Vacancy"
                                      className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>

                                    {/* External Link button */}
                                    {destinationUrl && (
                                      <a
                                        href={destinationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Test destination URL"
                                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}

                                    {/* Delete button */}
                                    <button
                                      onClick={() => handleDeleteJob(job.id, job.title)}
                                      title="Delete Listing"
                                      className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 flex items-center justify-center border border-rose-200 dark:border-rose-900 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                    <div>
                      Showing{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {filteredJobs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                      </strong>{" "}
                      to{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {Math.min(currentPage * pageSize, filteredJobs.length)}
                      </strong>{" "}
                      of{" "}
                      <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong>{" "}
                      vacancies
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="First Page"
                      >
                        «
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Prev
                      </button>

                      <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold">
                        Page {currentPage} of {totalPages}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Last Page"
                      >
                        »
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* =========================================================================
            TAB 2: EMPLOYERS CRUD
        ========================================================================= */}
        {activeTab === "EMPLOYERS" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <span>Verified Employers & SLBFE Directory</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Manage registered corporate accounts, SLBFE overseas recruiter licenses, and direct WhatsApp lines.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingEmployer({
                    displayName: "",
                    legalName: "",
                    district: "Colombo",
                    website: "https://",
                    verifiedDomain: "",
                    officialWhatsApp: "+94770000000",
                    verificationStatus: "VERIFIED_BUSINESS",
                    about: "",
                  });
                  setIsEmployerModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Register Employer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployers.map((emp) => (
                <div
                  key={emp.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={emp.logo}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{emp.displayName}</span>
                          {emp.verificationStatus !== "PENDING" && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{emp.legalName}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        Location: <span className="font-semibold text-slate-800 dark:text-slate-100">{emp.district}</span>
                      </div>
                      <div>
                        Direct WhatsApp: <span className="font-mono text-emerald-600">{emp.officialWhatsApp}</span>
                      </div>
                      {emp.slbfeLicenseNumber && (
                        <div className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                          SLBFE License: {emp.slbfeLicenseNumber}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 italic">{emp.about}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        emp.verificationStatus === "SLBFE_LICENSED"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : emp.verificationStatus === "VERIFIED_BUSINESS"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {emp.verificationStatus.replace("_", " ")}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingEmployer(emp);
                          setIsEmployerModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-600 hover:text-emerald-600 border border-slate-200 dark:border-slate-700"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployer(emp.id, emp.displayName)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: STRATEGIC RSS FEEDS & LEAD INGESTION MANAGER
        ========================================================================= */}
        {activeTab === "FEEDS" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Rss className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Lead Websites & RSS Ingestion Engine
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Competitive Advantage: Continuous ingestion pipeline pulling vacancies from ITPro.lk, TopJobs RSS, SLBFE Foreign Jobs feed, and web crawlers.
                </p>
              </div>

              <button
                onClick={() => setIsFeedModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add RSS Lead Source</span>
              </button>
            </div>

            {/* Feeds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feeds.map((feed) => (
                <div
                  key={feed.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Rss className="w-4 h-4 text-amber-500" />
                          <span>{feed.name}</span>
                        </div>
                        <a
                          href={feed.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono text-emerald-600 hover:underline flex items-center gap-1 mt-0.5 line-clamp-1"
                        >
                          <span>{feed.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {feed.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                      <div>
                        Category: <span className="font-semibold">{feed.category}</span>
                      </div>
                      <div>
                        Location: <span className="font-semibold">{feed.district}</span>
                      </div>
                      <div>
                        Sync Interval: <span className="font-semibold">{feed.autoSyncIntervalMinutes} mins</span>
                      </div>
                      <div>
                        Total Ingested:{" "}
                        <span className="font-bold text-emerald-600">{feed.itemsIngestedCount} leads</span>
                      </div>
                    </div>

                    {feed.lastSyncAt && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last synchronized: {formatDateRelative(feed.lastSyncAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleSyncFeedNow(feed.id, feed.name)}
                      disabled={isSyncingFeedId === feed.id}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${
                          isSyncingFeedId === feed.id ? "animate-spin" : ""
                        }`}
                      />
                      <span>
                        {isSyncingFeedId === feed.id ? "Syncing Feed..." : "Sync Now"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteFeed(feed.id, feed.name)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                      title="Remove Feed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sync History Audit Logs */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Recent Lead Ingestion Logs</span>
              </h3>

              <div className="space-y-2">
                {syncLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {log.feedName}
                      </div>
                      <div className="text-slate-500 text-[11px]">{log.message}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-semibold text-emerald-600">
                        +{log.itemsAdded} added
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {formatDateRelative(log.syncedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: APPLICANTS & DIRECT CANDIDATE CRM
        ========================================================================= */}
        {activeTab === "APPLICANTS" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Applicants & Direct Recruiter CRM
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Empowering candidates with direct employer contact vectors (WhatsApp, direct call, encrypted CV dispatch under PDPA).
                </p>
              </div>

              <button
                onClick={handleExportApplicantsCSV}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Target Vacancy</th>
                    <th className="py-3 px-3">CV & Documents</th>
                    <th className="py-3 px-3">Direct Contact Vectors</th>
                    <th className="py-3 px-3">Status Pipeline</th>
                    <th className="py-3 px-3 text-right">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {app.candidateName}
                        </div>
                        <div className="text-[11px] text-slate-500">{app.candidateEmail}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {jobs.find((j) => j.id === app.jobId)?.title || `Job #${app.jobId}`}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">
                          {jobs.find((j) => j.id === app.jobId)?.employer.displayName}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[11px]">{app.cvFileName}</span>
                        </div>
                        {app.coverNote && (
                          <div className="text-[10px] text-slate-500 italic line-clamp-1 mt-0.5">
                            "{app.coverNote}"
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          {/* Direct WhatsApp Vector */}
                          <a
                            href={`https://wa.me/${app.candidatePhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${app.candidateName}, this is regarding your application for ${
                                jobs.find((j) => j.id === app.jobId)?.title || "the vacancy"
                              } on JobeeLanka.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 flex items-center gap-1 font-semibold text-[11px]"
                            title="Chat Direct on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>

                          {/* Direct Phone Call Vector */}
                          <a
                            href={`tel:${app.candidatePhone}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 flex items-center gap-1 font-semibold text-[11px]"
                            title="Direct Phone Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleUpdateApplicationStatus(
                              app.id,
                              e.target.value as ApplicationSubmission["status"]
                            )
                          }
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="VIEWED">VIEWED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                        {formatDateRelative(app.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: MODERATION QUEUE (PRESERVED)
        ========================================================================= */}
        {activeTab === "QUEUE" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Incoming Triage & Trust Verification
                </h3>
                <p className="text-xs text-slate-500">
                  SLBFE foreign agency checks, scam prevention reports, and new business registrations
                </p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                Logged in as: <span className="text-emerald-600">{currentUser.name}</span>
              </span>
            </div>

            <div className="space-y-3">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    item.riskScore === "HIGH"
                      ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60"
                      : "bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : item.status === "FLAGGED"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.riskScore === "HIGH" && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span>HIGH RISK SCAM REPORT</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      Entity: <span className="font-bold text-slate-800 dark:text-slate-100">{item.entityName}</span> • Submitted by {item.submittedBy}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-slate-500 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleModerateImportedJob(item, "APPROVE")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Approve</span>
                    </button>
                    <button
                      onClick={() => handleModerateImportedJob(item, "REJECT")}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject / Block</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: STAFF ROLES & DIRECTORY
        ========================================================================= */}
        {activeTab === "STAFF" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Platform Personnel & Role-Based Access Control</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                    {staffList.length} Active Staff
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Authorized Super Administrators and operational personnel with granular permission boundaries.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsStaffModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map((staff) => {
                const isRootAdmin =
                  staff.email.toLowerCase() === "contactrajeevan@hotmail.com" ||
                  staff.email.toLowerCase() === "anasbikes1992@gmail.com";
                return (
                  <div
                    key={staff.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-extrabold text-base shrink-0">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {staff.name}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                staff.role === "SUPER_ADMIN"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                  : staff.role === "MODERATOR_STAFF"
                                  ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                  : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              }`}
                            >
                              {staff.role}
                            </span>
                            {isRootAdmin && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                (Super Admin)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 font-mono truncate">{staff.email}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {staff.department}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Granted Permissions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {staff.permissions.map((p, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Status: {staff.status}</span>
                      {!isRootAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(staff.id, staff.name)}
                          className="text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 text-[11px] transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: SYSTEM HEALTH
        ========================================================================= */}
        {activeTab === "SYSTEM" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-bento space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Cloudflare Edge & Crawler Ingestion Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                Live endpoint health, RSS feed syndication heartbeats, and AI engine crawler indexes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60">
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  Edge Status
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">99.98%</div>
                <div className="text-xs text-slate-500 mt-1">Cloudflare Colombo Edge</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
                <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                  Jobs In Catalog
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {jobs.length} Active
                </div>
                <div className="text-xs text-slate-500 mt-1">First-Party & RSS Syndicated</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                  Ingested Leads
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {feeds.reduce((acc, f) => acc + f.itemsIngestedCount, 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Across 4 partner channels</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60">
                <div className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase">
                  PDPA Compliance
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">100%</div>
                <div className="text-xs text-slate-500 mt-1">Zero unconsented resumes</div>
              </div>
            </div>

            {/* Supabase Database Sync Panel */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Supabase PostgreSQL Engine & Row Level Security (RLS)</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live database persistence for Jobs, Employers, Applications, and Admin Staff RBAC roles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSyncDatabase}
                  disabled={isSyncingDb}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDb ? "animate-spin" : ""}`} />
                  <span>{isSyncingDb ? "Synchronizing DB..." : "Sync Catalog to Supabase"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Database Ref</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                    yviravfjywxsiputejsu
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Region & Engine</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    Tokyo (ap-northeast-1) · Postgres 16
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Security Mode</div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Enforced RLS on all 4 tables</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* =========================================================================
          MODAL: CREATE / EDIT JOB
      ========================================================================= */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingJob?.id ? "Edit Vacancy" : "Create New Job Vacancy"}
              </h3>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob?.title || ""}
                    onChange={(e) => setEditingJob((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Careers in WHO World Health Organisation"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Job Code (Legacy) *
                  </label>
                  <input
                    type="text"
                    value={editingJob?.code || ""}
                    onChange={(e) => setEditingJob((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. 110B0PNNQ1R"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Application Destination URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingJob?.applicationUrl || editingJob?.applyUrl || ""}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        applicationUrl: e.target.value,
                        applyUrl: e.target.value,
                      }))
                    }
                    placeholder="https://company.com/careers/apply/123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Candidate clicking &quot;Apply Now&quot; will be redirected directly to this official link.
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    value={editingJob?.city || ""}
                    onChange={(e) => setEditingJob((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g. Colombo 2, or Any part of Sri Lanka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    District *
                  </label>
                  <select
                    value={editingJob?.district || "Colombo"}
                    onChange={(e) => setEditingJob((prev) => ({ ...prev, district: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Overseas">Overseas (SLBFE)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category / Industry *
                  </label>
                  <input
                    type="text"
                    value={editingJob?.industry || "Information Technology"}
                    onChange={(e) => setEditingJob((prev) => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g. INGO's in Sri Lanka, Finance Company Sites"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Listing Status *
                  </label>
                  <select
                    value={editingJob?.status || "ACTIVE"}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        status: e.target.value as "ACTIVE" | "INACTIVE",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Status ON)</option>
                    <option value="INACTIVE">INACTIVE (Status OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Work Mode *
                  </label>
                  <select
                    value={editingJob?.workMode || "HYBRID"}
                    onChange={(e) =>
                      setEditingJob((prev) => ({
                        ...prev,
                        workMode: e.target.value as "ONSITE" | "HYBRID" | "REMOTE",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="ONSITE">ONSITE</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="REMOTE">REMOTE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Views Count
                  </label>
                  <input
                    type="number"
                    value={editingJob?.viewsCount || 0}
                    onChange={(e) =>
                      setEditingJob((prev) => ({ ...prev, viewsCount: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct Contact Visibility Toggles */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Direct Contact Vectors (Default: HIDDEN)
                </span>
                <p className="text-[11px] text-slate-500">
                  By default, users only see the direct &quot;Apply on Official Employer Website&quot; link. Enable these only if direct contact is authorized.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingJob?.showWhatsApp)}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, showWhatsApp: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Show WhatsApp button</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingJob?.showEmail)}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, showEmail: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Show Email button</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingJob?.showPhone)}
                      onChange={(e) =>
                        setEditingJob((prev) => ({ ...prev, showPhone: e.target.checked }))
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Show Call button</span>
                  </label>
                </div>

                {/* Explicit Contact Target Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      WhatsApp / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={editingJob?.applyWhatsApp || ""}
                      onChange={(e) => setEditingJob((prev) => ({ ...prev, applyWhatsApp: e.target.value }))}
                      placeholder="e.g. +94773272498"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      HR Application Email
                    </label>
                    <input
                      type="email"
                      value={editingJob?.applyEmail || ""}
                      onChange={(e) => setEditingJob((prev) => ({ ...prev, applyEmail: e.target.value }))}
                      placeholder="e.g. careers@company.com"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Helpline Phone Number
                    </label>
                    <input
                      type="text"
                      value={editingJob?.employer?.officialWhatsApp || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingJob((prev) => ({
                          ...prev,
                          employer: {
                            ...(prev?.employer || {
                              id: "emp-custom",
                              slug: "custom",
                              legalName: "Employer",
                              displayName: "Employer",
                              logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80",
                              district: "Colombo",
                              website: "https://www.jobeelanka.com",
                              verifiedDomain: "jobeelanka.com",
                              verificationStatus: "VERIFIED_BUSINESS",
                              isFeatured: false,
                              about: "Verified employer organization.",
                            }),
                            officialWhatsApp: val,
                          },
                        }));
                      }}
                      placeholder="e.g. +94112320706"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Short Snippet / Summary
                </label>
                <textarea
                  rows={2}
                  value={editingJob?.shortSnippet || ""}
                  onChange={(e) =>
                    setEditingJob((prev) => ({ ...prev, shortSnippet: e.target.value }))
                  }
                  placeholder="Concise overview of the vacancy requirements and team environment..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Save Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BULK CSV IMPORT (FOR USER'S SPREADSHEETS)
      ========================================================================= */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>Import Jobs from CSV</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bulk upload or paste your job directory spreadsheet matching legacy back-office columns.
                </p>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* File upload zone */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Option 1: Choose .csv File from Computer
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-3"
                />
              </div>

              {/* Textarea for manual paste */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Option 2: Paste Raw CSV Data Directly
                  </label>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Template</span>
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={csvInputText}
                  onChange={(e) => {
                    setCsvInputText(e.target.value);
                    setCsvFeedback(null);
                  }}
                  placeholder={`code,title,employer,category,city,district,url,logo,status,views,showWhatsApp,showEmail,showPhone,dateAdded\n"110B0PNNQ1R","Careers in WHO World Health Organisation Sri Lanka","WHO Sri Lanka","INGO's in Sri Lanka","Any part of Sri Lanka","Colombo","https://who.int/careers","https://...","ACTIVE","1945","false","false","false","2026-11-06"`}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Feedback Alert */}
              {csvFeedback && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {csvFeedback}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                UTF-8 encoded RFC 4180 format supported.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isImportingCsv || !csvInputText.trim()}
                  onClick={handleImportCsvSubmit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  {isImportingCsv ? (
                    <span>Importing...</span>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Import Vacancies Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT EMPLOYER
      ========================================================================= */}
      {isEmployerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingEmployer?.id ? "Edit Employer Profile" : "Register New Employer"}
              </h3>
              <button
                onClick={() => setIsEmployerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEmployer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEmployer?.displayName || ""}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({ ...prev, displayName: e.target.value }))
                    }
                    placeholder="e.g. MAS Holdings"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    value={editingEmployer?.legalName || ""}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({ ...prev, legalName: e.target.value }))
                    }
                    placeholder="e.g. MAS Active (Pvt) Ltd"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingEmployer?.officialWhatsApp || ""}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({ ...prev, officialWhatsApp: e.target.value }))
                    }
                    placeholder="+94770000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    District
                  </label>
                  <select
                    value={editingEmployer?.district || "Colombo"}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({ ...prev, district: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Galle">Galle</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    SLBFE License No (if applicable)
                  </label>
                  <input
                    type="text"
                    value={editingEmployer?.slbfeLicenseNumber || ""}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({
                        ...prev,
                        slbfeLicenseNumber: e.target.value,
                      }))
                    }
                    placeholder="SLBFE/AL/2026/0941"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Verification Status
                  </label>
                  <select
                    value={editingEmployer?.verificationStatus || "VERIFIED_BUSINESS"}
                    onChange={(e) =>
                      setEditingEmployer((prev) => ({
                        ...prev,
                        verificationStatus: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="VERIFIED_BUSINESS">VERIFIED_BUSINESS</option>
                    <option value="SLBFE_LICENSED">SLBFE_LICENSED</option>
                    <option value="PARTNER_SOURCE">PARTNER_SOURCE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  About Organization
                </label>
                <textarea
                  rows={2}
                  value={editingEmployer?.about || ""}
                  onChange={(e) =>
                    setEditingEmployer((prev) => ({ ...prev, about: e.target.value }))
                  }
                  placeholder="Overview of business operations, hiring scope, and culture..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEmployerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW RSS LEAD SOURCE
      ========================================================================= */}
      {isFeedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Rss className="w-5 h-5 text-amber-500" />
                <span>Add Job Website / RSS / API Source</span>
              </h3>
              <button
                onClick={() => setIsFeedModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFeed} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Source Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFeedData.name}
                  onChange={(e) => setNewFeedData({ ...newFeedData, name: e.target.value })}
                  placeholder="e.g. TopJobs IT & Software RSS"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Website, RSS, Atom, or JSON API URL *
                </label>
                <input
                  type="url"
                  required
                  value={newFeedData.url}
                  onChange={(e) => setNewFeedData({ ...newFeedData, url: e.target.value })}
                  placeholder="https://example.com/careers or /rss/jobs.xml"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Category
                  </label>
                  <select
                    value={newFeedData.category}
                    onChange={(e) => setNewFeedData({ ...newFeedData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Banking & Finance">Banking & Finance</option>
                    <option value="Apparel & Manufacturing">Apparel & Manufacturing</option>
                    <option value="Overseas Careers (SLBFE Verified)">Overseas Careers (SLBFE)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Auto-Sync Frequency
                  </label>
                  <select
                    value={newFeedData.autoSyncIntervalMinutes}
                    onChange={(e) =>
                      setNewFeedData({
                        ...newFeedData,
                        autoSyncIntervalMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value={30}>Every 30 mins</option>
                    <option value={60}>Every 1 hour</option>
                    <option value={120}>Every 2 hours</option>
                    <option value={360}>Every 6 hours</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFeedModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
                >
                  Register Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW STAFF MEMBER
      ========================================================================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                <span>Add Staff Member</span>
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  placeholder="e.g. Ruwan Wickramasinghe"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Staff Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                  placeholder="staff@jobeelanka.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Role Category *
                  </label>
                  <select
                    value={newStaffData.role}
                    onChange={(e) => {
                      const role = e.target.value as StaffUser["role"];
                      const defaultDept =
                        role === "SUPER_ADMIN"
                          ? "Platform Governance"
                          : role === "MODERATOR_STAFF"
                          ? "Job Moderation & Quality Assurance"
                          : "Trust, Compliance & SLBFE Verification";
                      setNewStaffData({ ...newStaffData, role, department: defaultDept });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="MODERATOR_STAFF">Moderator Staff</option>
                    <option value="TRUST_SAFETY_STAFF">Trust & Safety Staff</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newStaffData.department}
                    onChange={(e) =>
                      setNewStaffData({ ...newStaffData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {isSubmittingStaff ? "Saving..." : "Save Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}
