import { useEffect, useState } from "react";

import {
  User,
  Phone,
  Mail,
  GraduationCap,
  ShieldCheck,
  Pencil,
} from "lucide-react";

import {
  getProfile,
  getColleges,
  updateProfile,
  sendCollegeOtp,
  verifyCollegeOtp,
} from "../../services/profileApi";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [colleges, setColleges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    universityId: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // College verification
  const [collegeEmail, setCollegeEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");

  /*
   * Load profile + colleges
   */
  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileData, collegeData] = await Promise.all([
          getProfile(),
          getColleges(),
        ]);

        setProfile(profileData);
        setColleges(collegeData);

        setCollegeEmail(profileData.college_email || "");
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(error.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /*
   * Enter edit mode
   */
  function handleEditProfile() {
    setFormData({
      fullName: profile.full_name || "",
      username: profile.username || "",
      universityId: profile.university_id || "",
      bio: profile.bio || "",
    });

    setSaveError("");
    setIsEditing(true);
  }

  /*
   * Cancel editing
   */
  function handleCancelEdit() {
    setIsEditing(false);
    setSaveError("");
  }

  /*
   * Save profile
   */
  async function handleSaveProfile() {
    try {
      setSaving(true);
      setSaveError("");

      const result = await updateProfile({
        fullName: formData.fullName,
        username: formData.username,
        universityId: formData.universityId,
        bio: formData.bio,
      });

      const updatedProfile = result.profile || result;

      setProfile(updatedProfile);

      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);

      setSaveError(error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  /*
   * Send college OTP
   */
  async function handleSendOtp() {
    try {
      setOtpError("");
      setOtpMessage("");

      const email = collegeEmail.trim().toLowerCase();

      if (!email) {
        setOtpError("Please enter your college email.");
        return;
      }

      setSendingOtp(true);

      const result = await sendCollegeOtp(email);

      setCollegeEmail(email);
      setOtpSent(true);
      setOtp("");

      setOtpMessage(result.message || "Verification code generated.");
    } catch (error) {
      console.error("Send OTP error:", error);

      setOtpError(error.message || "Unable to send verification code.");
    } finally {
      setSendingOtp(false);
    }
  }

  /*
   * Verify college OTP
   */
  async function handleVerifyOtp() {
    try {
      setOtpError("");
      setOtpMessage("");

      if (!otp) {
        setOtpError("Please enter the verification code.");
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setOtpError("Verification code must contain 6 digits.");
        return;
      }

      setVerifyingOtp(true);

      const result = await verifyCollegeOtp(otp);

      setProfile((previousProfile) => ({
        ...previousProfile,
        college_email: collegeEmail,
        college_verified: true,
      }));

      setOtpSent(false);
      setOtp("");

      setOtpMessage(result.message || "College email verified successfully.");
    } catch (error) {
      console.error("Verify OTP error:", error);

      setOtpError(error.message || "Unable to verify college email.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <div>
        <main className="px-8 py-12">
          <p className="text-gray-600">Loading profile...</p>
        </main>
      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div>
        <main className="px-8 py-12">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="px-8 py-12">
        {/* Header */}

        <h1 className="text-4xl font-bold">My Profile</h1>

        <p className="mt-3 text-gray-600">
          Manage your ClockIt profile and account information.
        </p>

        <section className="mt-10 max-w-3xl">
          {/* ================================= */}
          {/* PROFILE HEADER */}
          {/* ================================= */}

          <div className="flex items-center gap-5">
            {/* Profile picture */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              {profile.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-500" />
              )}
            </div>

            {/* Name + username + bio */}

            <div className="flex-1">
              {isEditing ? (
                <>
                  {/* Full name */}

                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-2xl font-semibold outline-none focus:border-black"
                    placeholder="Full name"
                  />

                  {/* Username */}

                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        username: e.target.value,
                      }))
                    }
                    className="mt-2 w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                    placeholder="Username"
                  />

                  {/* Bio */}

                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((previous) => ({
                        ...previous,
                        bio: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Tell us something about yourself..."
                    className="mt-3 w-full max-w-md resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">
                    {profile.full_name}
                  </h2>

                  <p className="mt-1 text-gray-600">@{profile.username}</p>

                  {profile.bio && (
                    <p className="mt-3 text-gray-600">{profile.bio}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* PERSONAL INFORMATION */}
          {/* ================================= */}

          <div className="mt-10">
            <h2 className="text-xl font-semibold">Personal Information</h2>

            <div className="mt-5 space-y-5">
              {/* Full Name */}

              <InfoItem
                icon={<User size={18} />}
                label="Full Name"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          fullName: e.target.value,
                        }))
                      }
                      className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                  ) : (
                    profile.full_name
                  )
                }
              />

              {/* Username */}

              <InfoItem
                icon={<User size={18} />}
                label="Username"
                value={
                  isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          username: e.target.value,
                        }))
                      }
                      className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                    />
                  ) : (
                    `@${profile.username}`
                  )
                }
              />

              {/* Phone */}

              <InfoItem
                icon={<Phone size={18} />}
                label="Phone Number"
                value={profile.phone || "Not added"}
              />
            </div>
          </div>

          {/* ================================= */}
          {/* COLLEGE VERIFICATION */}
          {/* ================================= */}

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">College Verification</h2>

                <p className="mt-2 text-gray-600">
                  Verify your college email to access student features.
                </p>
              </div>

              {profile.college_verified && (
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <ShieldCheck size={18} />
                  Verified
                </div>
              )}
            </div>

            <div className="mt-5 space-y-5">
              {/* University */}

              <InfoItem
                icon={<GraduationCap size={18} />}
                label="University"
                value={
                  isEditing ? (
                    <select
                      value={formData.universityId || ""}
                      onChange={(e) =>
                        setFormData((previous) => ({
                          ...previous,
                          universityId: e.target.value,
                        }))
                      }
                      className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-black"
                    >
                      <option value="">Select University</option>

                      {colleges.map((college) => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    profile.colleges?.name || "Not added"
                  )
                }
              />

              {/* College email */}

              <InfoItem
                icon={<Mail size={18} />}
                label="College Email"
                value={profile.college_email || "Not verified"}
              />
            </div>

            {/* ================================= */}
            {/* COLLEGE EMAIL VERIFICATION */}
            {/* ================================= */}

            {!profile.college_verified && (
              <div className="mt-6 max-w-md">
                <label className="text-sm font-medium text-gray-700">
                  College Email
                </label>

                <input
                  type="email"
                  value={collegeEmail}
                  onChange={(e) => {
                    setCollegeEmail(e.target.value);
                    setOtpError("");
                    setOtpMessage("");
                  }}
                  disabled={otpSent}
                  placeholder="yourname@college.edu"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black disabled:bg-gray-100"
                />

                {!otpSent && (
                  <button
                    type="button"
                    disabled={sendingOtp}
                    onClick={handleSendOtp}
                    className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendingOtp ? "Sending..." : "Send Verification Code"}
                  </button>
                )}

                {otpSent && (
                  <div className="mt-5">
                    <label className="text-sm font-medium text-gray-700">
                      Verification Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                        setOtp(value);
                        setOtpError("");
                      }}
                      placeholder="Enter 6-digit code"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-black"
                    />

                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        disabled={verifyingOtp}
                        onClick={handleVerifyOtp}
                        className="mt-4 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                      >
                        {verifyingOtp ? "Verifying..." : "Verify"}
                      </button>

                      <button
                        type="button"
                        disabled={sendingOtp}
                        onClick={handleSendOtp}
                        className="mt-4 text-sm font-medium text-gray-600 hover:text-black disabled:opacity-50"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {otpMessage && (
                  <p className="mt-3 text-sm text-green-600">{otpMessage}</p>
                )}

                {otpError && (
                  <p className="mt-3 text-sm text-red-500">{otpError}</p>
                )}
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* SAVE / CANCEL / EDIT */}
          {/* ================================= */}

          {!isEditing ? (
            <button
              type="button"
              onClick={handleEditProfile}
              className="mt-8 flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="mt-8">
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveProfile}
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCancelEdit}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {saveError && (
                <p className="mt-3 text-sm text-red-500">{saveError}</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/*
 * Reusable information row
 */
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-gray-500">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500">{label}</p>

        <div className="mt-1 font-medium">{value}</div>
      </div>
    </div>
  );
}

export default Profile;
