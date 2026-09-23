import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api";
import {
  User,
  Mail,
  Phone,
  AtSign,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  BadgeCheck,
  Trash2,
} from "lucide-react";

const ProfilePage = () => {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    user?.profilePicture || null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Keep form synchronized if user context changes asynchronously
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (!profilePicture) {
        setProfilePicturePreview(user.profilePicture || null);
      }
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Profile picture must be in JPG, PNG, or WebP format.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Profile picture must be smaller than 5MB.",
      });
      return;
    }

    setMessage(null);
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onload = (event) => setProfilePicturePreview(event.target?.result);
    reader.readAsDataURL(file);
  };

  const handleClearSelectedImage = () => {
    setProfilePicture(null);
    setProfilePicturePreview(user?.profilePicture || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("username", formData.username);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);

      if (profilePicture) {
        payload.append("profilePicture", profilePicture);
      }

      const { data } = await API.put("/auth/me", payload);

      if (setUser) setUser(data.data);
      setProfilePicture(null);
      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name = "Guest") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <div className="dashboard-shell space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        <h1 className="dashboard-title">My Profile</h1>
      </div>

      <div className="page-card">
        {/* Profile Avatar Header */}
        <div className="mb-6 text-center">
          <div className="relative inline-block mb-3">
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt={user?.name || "Profile"}
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-2xl flex items-center justify-center border-4 border-indigo-600 shadow-md">
                {getInitials(user?.name)}
              </div>
            )}

            {/* Picture Upload Trigger Button */}
            <label
              htmlFor="profile-picture-input"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer border-2 border-white dark:border-slate-800 transition-colors shadow"
              title="Upload profile picture"
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleProfilePictureChange}
              disabled={saving}
              className="hidden"
            />
          </div>

          <div>
            <div className="font-bold text-lg text-slate-800 dark:text-slate-100">
              {user?.name || "User Name"}
            </div>
            {formData.username && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                @{formData.username}
              </div>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 mt-2 border border-indigo-200 dark:border-indigo-800 capitalize">
              <BadgeCheck className="w-3.5 h-3.5" />
              {user?.role || "User"}
            </span>
          </div>
        </div>

        {/* Feedback Alert Notification */}
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-6 text-xs font-medium ${
              message.type === "error"
                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            )}
            <span className="flex-1">{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="p-1 hover:opacity-75 cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Profile Details Form */}
        <form onSubmit={handleSubmit} className="dashboard-form-stack">
          {/* Full Name */}
          <div>
            <label className="dashboard-label required" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="dashboard-input pl-10"
                disabled={saving}
                placeholder="John Doe"
              />
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="dashboard-label" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="dashboard-input pl-10"
                disabled={saving}
                placeholder="johndoe"
              />
              <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="dashboard-subtitle mt-1 block">
              {formData.username
                ? `@${formData.username}`
                : "Optional unique handle for your profile"}
            </span>
          </div>

          {/* Email Address */}
          <div>
            <label className="dashboard-label required" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="dashboard-input pl-10"
                disabled={saving}
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="dashboard-subtitle mt-1 block">
              Used for account recovery and platform notifications.
            </span>
          </div>

          {/* Phone Number */}
          <div>
            <label className="dashboard-label" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 700 000 000"
                className="dashboard-input pl-10"
                disabled={saving}
              />
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Selected File Banner */}
          {profilePicture && (
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-xs text-indigo-700 dark:text-indigo-300">
              <span className="truncate">
                ✓ New picture selected: <strong>{profilePicture.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleClearSelectedImage}
                className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                title="Cancel image selection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="dashboard-btn dashboard-btn--success inline-flex items-center gap-2"
            disabled={saving}
            style={{ alignSelf: "flex-start" }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;