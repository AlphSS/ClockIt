import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User, Mail, Phone, GraduationCap, ShieldCheck, Pencil, Home, Users, MapPin, CalendarDays, Wallet, CheckCircle2, Save, X, ChevronRight, LogOut, Building2, BedDouble, Cigarette, Moon,
  Utensils, MessageCircle, Sparkles,
} from "lucide-react";

import { supabase } from "../../services/supabase";

import Navbar from "./NavBar";
import Footer from "./Footer";

import {
  getProfile,
  getColleges,
  updateProfile,
  sendCollegeOtp,
  verifyCollegeOtp,
  getPreferences,
  updatePreferences,
} from "../../services/profileApi";

import "./Profile.css";


function Profile() {

  const navigate = useNavigate();


  // ==========================================
  // PROFILE STATE
  // ==========================================

  const [profile, setProfile] = useState(null);
  const [colleges, setColleges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("overview");

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    universityId: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");


  // ==========================================
  // COLLEGE VERIFICATION STATE
  // ==========================================

  const [collegeEmail, setCollegeEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");


  // ==========================================
  // STAY PREFERENCES
  // ==========================================

  const [stayPreferences, setStayPreferences] = useState({
    city: "",
    areas: "",
    minBudget: "",
    maxBudget: "",
    accommodationType: "",
    bhk: "",
    furnishing: "",
    moveInDate: "",
    amenities: [],
  });


  // ==========================================
  // FLATMATE PREFERENCES
  // ==========================================

  const [flatmatePreferences, setFlatmatePreferences] = useState({
    preferredGender: "",
    minAge: "",
    maxAge: "",
    smoking: "",
    drinking: "",
    sleepSchedule: "",
    cleanliness: "",
    socialPreference: "",
    foodPreference: "",
    guests: "",
    pets: "",
  });


  // ==========================================
  // AMENITIES
  // ==========================================

  const amenities = [
    "Wi-Fi",
    "Parking",
    "Laundry",
    "AC",
    "Kitchen",
    "Gym",
    "Power Backup",
    "Security",
  ];


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {

    async function loadProfile() {

      try {

        const [profileData, collegeData, preferencesData] = await Promise.all([
          getProfile(),
          getColleges(),
          getPreferences(),
        ]);

        setProfile(profileData);
        setColleges(collegeData);

        if (preferencesData?.flatPreferences) {
          setStayPreferences((previous) => ({
            ...previous,
            city: preferencesData.flatPreferences.preferred_location || "",
            minBudget: preferencesData.flatPreferences.min_budget ?? "",
            maxBudget: preferencesData.flatPreferences.max_budget ?? "",
            bhk: preferencesData.flatPreferences.preferred_bhk || "",
            furnishing:
              preferencesData.flatPreferences.furnishing_preference || "",
            moveInDate:
              preferencesData.flatPreferences.preferred_move_in_date || "",
          }));
        }

        if (preferencesData?.flatmatePreferences) {
          setFlatmatePreferences((previous) => ({
            ...previous,
            preferredGender:
              preferencesData.flatmatePreferences.preferred_gender || "",
            minAge: preferencesData.flatmatePreferences.min_age ?? "",
            maxAge: preferencesData.flatmatePreferences.max_age ?? "",
            smoking:
              preferencesData.flatmatePreferences.smoking_preference || "",
            sleepSchedule:
              preferencesData.flatmatePreferences.sleep_schedule || "",
            cleanliness:
              preferencesData.flatmatePreferences.cleanliness_preference || "",
            foodPreference:
              preferencesData.flatmatePreferences.food_preference || "",
          }));
        }

        setCollegeEmail(profileData.college_email || "");

      } catch (err) {

        console.error("Profile loading error:", err);

        setError(err.message || "Unable to load your profile.");

      } finally {

        setLoading(false);

      }

    }

    loadProfile();

  }, []);


  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {

      console.error("Logout failed:", logoutError);

      return;

    }

    navigate("/login", { replace: true });

  }


  // ==========================================
  // PROFILE EDITING
  // ==========================================

  function handleEditProfile() {

    setFormData({

      fullName: profile.full_name || "",

      username: profile.username || "",

      universityId: profile.university_id || "",

      bio: profile.bio || "",

    });

    setSaveError("");
    setSaveMessage("");

    setIsEditing(true);

  }


  function handleCancelEdit() {

    setIsEditing(false);

    setSaveError("");
    setSaveMessage("");

  }


  async function handleSaveProfile() {

    try {

      setSaving(true);

      setSaveError("");
      setSaveMessage("");

      const result = await updateProfile({

        fullName: formData.fullName,

        username: formData.username,

        universityId: formData.universityId,

        bio: formData.bio,

      });

      const updatedProfile = result.profile || result;

      setProfile(updatedProfile);

      setIsEditing(false);

      setSaveMessage("Profile updated successfully.");

    } catch (err) {

      console.error("Profile update error:", err);

      setSaveError(err.message || "Unable to update your profile.");

    } finally {

      setSaving(false);

    }

  }


  // ==========================================
  // COLLEGE VERIFICATION
  // ==========================================

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

      setOtpMessage(
        result.message || "Verification code sent successfully."
      );

    } catch (err) {

      console.error("OTP error:", err);

      setOtpError(err.message || "Unable to send verification code.");

    } finally {

      setSendingOtp(false);

    }

  }


  async function handleVerifyOtp() {

    try {

      setOtpError("");
      setOtpMessage("");

      if (!/^\d{6}$/.test(otp)) {

        setOtpError("Enter a valid 6-digit verification code.");

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

      setOtpMessage(
        result.message || "College email verified successfully."
      );

    } catch (err) {

      console.error("Verification error:", err);

      setOtpError(err.message || "Unable to verify your college email.");

    } finally {

      setVerifyingOtp(false);

    }

  }


  // ==========================================
  // PREFERENCE HANDLERS
  // ==========================================

  function handleStayChange(event) {

    const { name, value } = event.target;

    setStayPreferences((previous) => ({

      ...previous,

      [name]: value,

    }));

  }


  function handleFlatmateChange(event) {

    const { name, value } = event.target;

    setFlatmatePreferences((previous) => ({

      ...previous,

      [name]: value,

    }));

  }


  function handleAmenityChange(amenity) {

    setStayPreferences((previous) => {

      const selectedAmenities = previous.amenities;

      const updatedAmenities = selectedAmenities.includes(amenity)

        ? selectedAmenities.filter((item) => item !== amenity)

        : [...selectedAmenities, amenity];

      return {

        ...previous,

        amenities: updatedAmenities,

      };

    });

  }


  async function handleStaySubmit(event) {

    event.preventDefault();

    try {

      setSaveMessage("");
      setSaveError("");

      await updatePreferences({

        flatPreferences: {

          preferred_location: stayPreferences.city.trim() || null,

          min_budget: stayPreferences.minBudget
            ? Number(stayPreferences.minBudget)
            : null,

          max_budget: stayPreferences.maxBudget
            ? Number(stayPreferences.maxBudget)
            : null,

          preferred_bhk: stayPreferences.bhk || null,

          furnishing_preference: stayPreferences.furnishing || null,

          preferred_move_in_date: stayPreferences.moveInDate || null,

        },

      });

      setSaveMessage("Flat preferences saved successfully.");

    } catch (err) {

      console.error("Flat preferences update error:", err);

      setSaveError(err.message || "Unable to save flat preferences.");

    }

  }


  async function handleFlatmateSubmit(event) {

    event.preventDefault();

    try {

      setSaveMessage("");
      setSaveError("");

      await updatePreferences({

        flatmatePreferences: {

          preferred_gender:
            flatmatePreferences.preferredGender || null,

          min_age: flatmatePreferences.minAge
            ? Number(flatmatePreferences.minAge)
            : null,

          max_age: flatmatePreferences.maxAge
            ? Number(flatmatePreferences.maxAge)
            : null,

          smoking_preference:
            flatmatePreferences.smoking || null,

          sleep_schedule:
            flatmatePreferences.sleepSchedule || null,

          cleanliness_preference:
            flatmatePreferences.cleanliness || null,

          food_preference:
            flatmatePreferences.foodPreference || null,

        },

      });

      setSaveMessage("Flatmate preferences saved successfully.");

    } catch (err) {

      console.error("Flatmate preferences update error:", err);

      setSaveError(
        err.message || "Unable to save flatmate preferences."
      );

    }

  }


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="profile-page">

        <Navbar />

        <main className="profile-loading">

          <div className="loading-spinner"></div>

          <p>Preparing your ClockIt profile...</p>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (

      <div className="profile-page">

        <Navbar />

        <main className="profile-error">

          <h2>Something went wrong</h2>

          <p>{error}</p>

        </main>

      </div>

    );

  }


  // ==========================================
  // MAIN PROFILE PAGE
  // ==========================================

  return (

    <div className="profile-page">

      <Navbar />


      <main className="profile-dashboard">


        {/* =====================================
            DASHBOARD GRID
        ===================================== */}

        <div className="profile-dashboard-grid">


          {/* =====================================
              LEFT SIDEBAR
          ===================================== */}

          <aside className="profile-sidebar">


            {/* SIDEBAR INTRODUCTION */}

            <div className="sidebar-introduction">

              <p className="sidebar-eyebrow">
                YOUR CLOCKIT SPACE
              </p>

              <h1>My Profile</h1>

              <p className="sidebar-description">

                Manage your identity, living preferences,
                and community experience.

              </p>

            </div>


            <div className="sidebar-divider"></div>


            {/* USER SUMMARY */}

            <div className="sidebar-profile">

              <div className="sidebar-avatar">

                {profile.profile_picture ? (

                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                  />

                ) : (

                  <User size={36} strokeWidth={1.4} />

                )}

              </div>


              <h2>{profile.full_name}</h2>

              <p className="sidebar-username">
                @{profile.username}
              </p>


              {profile.colleges?.name && (

                <div className="sidebar-university">

                  <GraduationCap size={14} />

                  <span>{profile.colleges.name}</span>

                </div>

              )}


              {profile.college_verified && (

                <div className="sidebar-verified">

                  <ShieldCheck size={14} />

                  College verified

                </div>

              )}

            </div>


            <div className="sidebar-divider"></div>


            {/* NAVIGATION */}

            <nav className="profile-sidebar-navigation">


              <p className="sidebar-label">
                ACCOUNT
              </p>


              <button
                className={
                  activeSection === "overview"
                    ? "sidebar-nav-item active"
                    : "sidebar-nav-item"
                }
                onClick={() => {

                  setActiveSection("overview");
                  setSaveMessage("");

                }}
              >

                <User size={18} />

                <span>Profile Overview</span>

                <ChevronRight size={16} />

              </button>


              <p className="sidebar-label preferences-label">
                PREFERENCES
              </p>


              <button
                className={
                  activeSection === "stay"
                    ? "sidebar-nav-item active"
                    : "sidebar-nav-item"
                }
                onClick={() => {

                  setActiveSection("stay");
                  setSaveMessage("");

                }}
              >

                <Home size={18} />

                <span>Flat Preferences</span>

                <ChevronRight size={16} />

              </button>


              <button
                className={
                  activeSection === "flatmate"
                    ? "sidebar-nav-item active"
                    : "sidebar-nav-item"
                }
                onClick={() => {

                  setActiveSection("flatmate");
                  setSaveMessage("");

                }}
              >

                <Users size={18} />

                <span>Flatmate Preferences</span>

                <ChevronRight size={16} />

              </button>


            </nav>


            {/* ACCOUNT STATUS */}

            <div className="sidebar-account-status">

              <div className="sidebar-divider"></div>

              <p className="sidebar-label">
                ACCOUNT STATUS
              </p>


              <div className="sidebar-status">

                <div className="status-dot"></div>

                <div>

                  <strong>Account active</strong>

                  <span>
                    Your ClockIt journey starts here.
                  </span>

                </div>

              </div>

            </div>


            {/* LOGOUT */}

            <div className="sidebar-logout">

              <button
                className="logout-button"
                onClick={handleLogout}
              >

                <LogOut size={17} />

                <span>Log out</span>

              </button>

            </div>


          </aside>


          {/* =====================================
              RIGHT CONTENT
          ===================================== */}

          <div className="profile-content">


            {/* =====================================
                PROFILE OVERVIEW
            ===================================== */}

            {activeSection === "overview" && (

              <section className="dashboard-card">


                <div className="card-heading">

                  <div>

                    <p className="card-eyebrow">
                      ACCOUNT DETAILS
                    </p>

                    <h2>Personal Information</h2>

                    <p>
                      Manage your personal details and
                      college identity.
                    </p>

                  </div>


                  {!isEditing && (

                    <button
                      className="outline-button"
                      onClick={handleEditProfile}
                    >

                      <Pencil size={16} />

                      Edit Profile

                    </button>

                  )}

                </div>


                {/* PROFILE INTRO */}

                <div className="profile-intro">

                  <div className="intro-avatar">

                    {profile.profile_picture ? (

                      <img
                        src={profile.profile_picture}
                        alt="Profile"
                      />

                    ) : (

                      <User size={42} />

                    )}

                  </div>


                  <div>

                    <h3>{profile.full_name}</h3>

                    <p>@{profile.username}</p>

                    {profile.bio && (

                      <span>{profile.bio}</span>

                    )}

                  </div>

                </div>


                {/* EDIT FORM */}

                {isEditing ? (

                  <div className="profile-edit-form">


                    <div className="form-grid">


                      <FormField label="Full Name">

                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              fullName: event.target.value,
                            }))
                          }
                        />

                      </FormField>


                      <FormField label="Username">

                        <input
                          type="text"
                          value={formData.username}
                          onChange={(event) =>
                            setFormData((previous) => ({
                              ...previous,
                              username: event.target.value,
                            }))
                          }
                        />

                      </FormField>


                    </div>


                    <FormField label="University">

                      <select
                        value={formData.universityId}
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            universityId: event.target.value,
                          }))
                        }
                      >

                        <option value="">
                          Select University
                        </option>

                        {colleges.map((college) => (

                          <option
                            key={college.id}
                            value={college.id}
                          >

                            {college.name}

                          </option>

                        ))}

                      </select>

                    </FormField>


                    <FormField label="Bio">

                      <textarea
                        rows="4"
                        value={formData.bio}
                        placeholder="Tell us something about yourself..."
                        onChange={(event) =>
                          setFormData((previous) => ({
                            ...previous,
                            bio: event.target.value,
                          }))
                        }
                      />

                    </FormField>


                    <div className="form-actions">

                      <button
                        className="primary-button"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >

                        <Save size={16} />

                        {saving ? "Saving..." : "Save Changes"}

                      </button>


                      <button
                        className="cancel-button"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >

                        <X size={16} />

                        Cancel

                      </button>

                    </div>


                    {saveError && (

                      <p className="form-error">
                        {saveError}
                      </p>

                    )}

                  </div>

                ) : (

                  /* PERSONAL DETAILS */

                  <div className="details-grid">


                    <DetailItem
                      icon={<User size={18} />}
                      label="Full Name"
                      value={profile.full_name}
                    />


                    <DetailItem
                      icon={<Mail size={18} />}
                      label="Account Email"
                      value={profile.email || "Not available"}
                    />


                    <DetailItem
                      icon={<Phone size={18} />}
                      label="Phone Number"
                      value={profile.phone || "Not added"}
                    />


                    <DetailItem
                      icon={<GraduationCap size={18} />}
                      label="University"
                      value={
                        profile.colleges?.name || "Not selected"
                      }
                    />


                    <DetailItem
                      icon={<ShieldCheck size={18} />}
                      label="College Verification"
                      value={
                        profile.college_verified
                          ? "Verified"
                          : "Not verified"
                      }
                    />


                    <DetailItem
                      icon={<CalendarDays size={18} />}
                      label="Member Since"
                      value={
                        profile.created_at
                          ? new Date(
                              profile.created_at
                            ).toLocaleDateString()
                          : "Recently joined"
                      }
                    />


                  </div>

                )}


                {/* COLLEGE VERIFICATION */}

                <div className="verification-section">


                  <div className="section-heading">

                    <div className="section-heading-icon">

                      <ShieldCheck size={20} />

                    </div>

                    <div>

                      <h3>College Verification</h3>

                      <p>
                        Verify your college email to build trust
                        within the ClockIt community.
                      </p>

                    </div>

                  </div>


                  {profile.college_verified ? (

                    <div className="verified-message">

                      <CheckCircle2 size={20} />

                      <div>

                        <strong>College email verified</strong>

                        <p>{profile.college_email}</p>

                      </div>

                    </div>

                  ) : (

                    <div className="verification-form">


                      <FormField label="College Email">

                        <input
                          type="email"
                          value={collegeEmail}
                          onChange={(event) =>
                            setCollegeEmail(event.target.value)
                          }
                          placeholder="you@college.edu"
                        />

                      </FormField>


                      {!otpSent ? (

                        <button
                          className="primary-button"
                          onClick={handleSendOtp}
                          disabled={sendingOtp}
                        >

                          {sendingOtp
                            ? "Sending..."
                            : "Send Verification Code"}

                        </button>

                      ) : (

                        <div className="otp-box">


                          <FormField label="Enter 6-digit OTP">

                            <input
                              type="text"
                              maxLength="6"
                              value={otp}
                              onChange={(event) => {

                                setOtp(
                                  event.target.value.replace(
                                    /\D/g,
                                    ""
                                  )
                                );

                              }}
                              placeholder="000000"
                            />

                          </FormField>


                          <div className="otp-actions">

                            <button
                              className="primary-button"
                              onClick={handleVerifyOtp}
                              disabled={verifyingOtp}
                            >

                              {verifyingOtp
                                ? "Verifying..."
                                : "Verify OTP"}

                            </button>


                            <button
                              className="text-button"
                              onClick={handleSendOtp}
                              disabled={sendingOtp}
                            >

                              Resend Code

                            </button>

                          </div>

                        </div>

                      )}


                      {otpMessage && (

                        <p className="form-success">
                          {otpMessage}
                        </p>

                      )}

                      {otpError && (

                        <p className="form-error">
                          {otpError}
                        </p>

                      )}

                    </div>

                  )}

                </div>


              </section>

            )}


            {/* =====================================
                FLAT PREFERENCES
            ===================================== */}

            {activeSection === "stay" && (

              <section className="dashboard-card">


                <div className="card-heading">

                  <div>

                    <p className="card-eyebrow">
                      FIND YOUR SPACE
                    </p>

                    <h2>Flat Preferences</h2>

                    <p>
                      Tell us what you're looking for in
                      your next place.
                    </p>

                  </div>


                  <div className="card-icon">

                    <Home size={22} />

                  </div>

                </div>


                <form onSubmit={handleStaySubmit}>


                  <div className="preference-section-title">

                    <MapPin size={18} />

                    <h3>Location & Budget</h3>

                  </div>


                  <div className="form-grid">


                    <FormField label="Preferred City">

                      <input
                        type="text"
                        name="city"
                        value={stayPreferences.city}
onChange={(e) =>
  setStayPreferences({
    ...stayPreferences,
    city: e.target.value,
  })
}
                        placeholder="e.g. Pune"
                      />

                    </FormField>


                    <FormField label="Preferred Areas">

                      <input
                        type="text"
                        name="areas"
                        value={stayPreferences.areas}
                        onChange={handleStayChange}
                        placeholder="e.g. Wakad, Hinjewadi"
                      />

                    </FormField>


                    <FormField label="Minimum Monthly Budget">

                      <div className="input-with-icon">

                        <Wallet size={16} />

                        <input
                          type="number"
                          name="minBudget"
                          value={stayPreferences.minBudget}
onChange={(e) =>
  setStayPreferences({
    ...stayPreferences,
    minBudget: e.target.value,
  })
}
                          placeholder="Minimum ₹"
                        />

                      </div>

                    </FormField>


                    <FormField label="Maximum Monthly Budget">

                      <div className="input-with-icon">

                        <Wallet size={16} />

                        <input
                          type="number"
                          name="maxBudget"
                          value={stayPreferences.maxBudget}
onChange={(e) =>
  setStayPreferences({
    ...stayPreferences,
    maxBudget: e.target.value,
  })
}
                          placeholder="Maximum ₹"
                        />

                      </div>

                    </FormField>


                  </div>


                  <div className="preference-section-title">

                    <Building2 size={18} />

                    <h3>Accommodation Details</h3>

                  </div>


                  <div className="form-grid">


                    <FormField label="Accommodation Type">

                      <select
                        name="accommodationType"
                        value={stayPreferences.accommodationType}
                        onChange={handleStayChange}
                      >

                        <option value="">
                          Select type
                        </option>

                        <option value="1bhk">
                          1 BHK
                        </option>

                        <option value="2bhk">
                          2 BHK
                        </option>

                        <option value="3bhk">
                          3 BHK
                        </option>

                        <option value="shared_flat">
                          Shared Flat
                        </option>

                        <option value="private_room">
                          Private Room
                        </option>

                        <option value="pg">
                          PG
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Preferred BHK">

                      <select
                        name="bhk"
                        value={stayPreferences.bhk}
                        onChange={handleStayChange}
                      >

                        <option value="">
                          Select BHK
                        </option>

                        <option value="1">1 BHK</option>

                        <option value="2">2 BHK</option>

                        <option value="3">3 BHK</option>

                        <option value="4">4+ BHK</option>

                      </select>

                    </FormField>


                    <FormField label="Furnishing">

                      <select
                        name="furnishing"
                        value={stayPreferences.furnishing}
                        onChange={handleStayChange}
                      >

                        <option value="">
                          Select furnishing
                        </option>

                        <option value="fully_furnished">
                          Fully Furnished
                        </option>

                        <option value="semi_furnished">
                          Semi Furnished
                        </option>

                        <option value="unfurnished">
                          Unfurnished
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Expected Move-in Date">

                      <input
                        type="date"
                        name="moveInDate"
                        value={stayPreferences.moveInDate}
                        onChange={handleStayChange}
                      />

                    </FormField>


                  </div>


                  <div className="preference-section-title">

                    <Sparkles size={18} />

                    <h3>Preferred Amenities</h3>

                  </div>


                  <div className="amenities-grid">

                    {amenities.map((amenity) => (

                      <label
                        key={amenity}
                        className={
                          stayPreferences.amenities.includes(amenity)
                            ? "amenity-option selected"
                            : "amenity-option"
                        }
                      >

                        <input
                          type="checkbox"
                          checked={stayPreferences.amenities.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityChange(amenity)
                          }
                        />

                        <CheckCircle2 size={16} />

                        <span>{amenity}</span>

                      </label>

                    ))}

                  </div>


                  <div className="preference-actions">

                    <button
                      className="primary-button"
                      type="submit"
                    >

                      <Save size={16} />

                      Save Flat Preferences

                    </button>

                  </div>


                </form>

              </section>

            )}


            {/* =====================================
                FLATMATE PREFERENCES
            ===================================== */}

            {activeSection === "flatmate" && (

              <section className="dashboard-card">


                <div className="card-heading">

                  <div>

                    <p className="card-eyebrow">
                      FIND YOUR PEOPLE
                    </p>

                    <h2>Flatmate Finder Preferences</h2>

                    <p>
                      Share your lifestyle preferences to help
                      find a compatible flatmate.
                    </p>

                  </div>


                  <div className="card-icon">

                    <Users size={22} />

                  </div>

                </div>


                <form onSubmit={handleFlatmateSubmit}>


                  <div className="preference-section-title">

                    <Users size={18} />

                    <h3>Basic Preferences</h3>

                  </div>


                  <div className="form-grid">


                    <FormField label="Preferred Flatmate Gender">

                      <select
                        name="preferredGender"
                        value={flatmatePreferences.preferredGender}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="any">Any</option>

                        <option value="male">Male</option>

                        <option value="female">Female</option>

                        <option value="prefer_not_to_say">
                          Prefer not to say
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Minimum Age">

                      <input
                        type="number"
                        name="minAge"
                        value={flatmatePreferences.minAge}
                        onChange={handleFlatmateChange}
                        placeholder="Minimum age"
                        min="18"
                      />

                    </FormField>


                    <FormField label="Maximum Age">

                      <input
                        type="number"
                        name="maxAge"
                        value={flatmatePreferences.maxAge}
                        onChange={handleFlatmateChange}
                        placeholder="Maximum age"
                        min="18"
                      />

                    </FormField>


                  </div>


                  <div className="preference-section-title">

                    <Moon size={18} />

                    <h3>Lifestyle Preferences</h3>

                  </div>


                  <div className="form-grid">


                    <FormField label="Smoking Preference">

                      <select
                        name="smoking"
                        value={flatmatePreferences.smoking}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="non_smoker">
                          Non-smoker
                        </option>

                        <option value="smoker">
                          Smoker
                        </option>

                        <option value="no_preference">
                          No preference
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Drinking Preference">

                      <select
                        name="drinking"
                        value={flatmatePreferences.drinking}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="non_drinker">
                          Non-drinker
                        </option>

                        <option value="drinker">
                          Drinker
                        </option>

                        <option value="no_preference">
                          No preference
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Sleep Schedule">

                      <select
                        name="sleepSchedule"
                        value={flatmatePreferences.sleepSchedule}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select schedule
                        </option>

                        <option value="early_bird">
                          Early Bird
                        </option>

                        <option value="night_owl">
                          Night Owl
                        </option>

                        <option value="flexible">
                          Flexible
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Cleanliness Level">

                      <select
                        name="cleanliness"
                        value={flatmatePreferences.cleanliness}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="very_clean">
                          Very Clean
                        </option>

                        <option value="moderate">
                          Moderately Clean
                        </option>

                        <option value="relaxed">
                          Relaxed
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Social Preference">

                      <select
                        name="socialPreference"
                        value={flatmatePreferences.socialPreference}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="introvert">
                          Quiet & Private
                        </option>

                        <option value="extrovert">
                          Social & Outgoing
                        </option>

                        <option value="balanced">
                          Balanced
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Food Preference">

                      <select
                        name="foodPreference"
                        value={flatmatePreferences.foodPreference}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="vegetarian">
                          Vegetarian
                        </option>

                        <option value="non_vegetarian">
                          Non-vegetarian
                        </option>

                        <option value="vegan">
                          Vegan
                        </option>

                        <option value="no_preference">
                          No preference
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Guests Preference">

                      <select
                        name="guests"
                        value={flatmatePreferences.guests}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="rarely">
                          Rarely
                        </option>

                        <option value="sometimes">
                          Sometimes
                        </option>

                        <option value="often">
                          Often
                        </option>

                        <option value="no_guests">
                          No guests
                        </option>

                      </select>

                    </FormField>


                    <FormField label="Pets Preference">

                      <select
                        name="pets"
                        value={flatmatePreferences.pets}
                        onChange={handleFlatmateChange}
                      >

                        <option value="">
                          Select preference
                        </option>

                        <option value="pet_friendly">
                          Pet-friendly
                        </option>

                        <option value="no_pets">
                          Prefer no pets
                        </option>

                        <option value="no_preference">
                          No preference
                        </option>

                      </select>

                    </FormField>


                  </div>


                  <div className="preference-actions">

                    <button
                      className="primary-button"
                      type="submit"
                    >

                      <Save size={16} />

                      Save Flatmate Preferences

                    </button>

                  </div>


                </form>

              </section>

            )}


            {/* SAVE ERROR MESSAGE */}

            {saveError && (

              <div className="global-save-message">

                <X size={18} />

                <span>{saveError}</span>

              </div>

            )}

            {/* SUCCESS MESSAGE */}

            {saveMessage && (

              <div className="global-save-message">

                <CheckCircle2 size={18} />

                <span>{saveMessage}</span>

              </div>

            )}


          </div>

        </div>

      </main>


      <Footer />

    </div>

  );

}


// ==========================================
// REUSABLE FORM FIELD
// ==========================================

function FormField({ label, children }) {

  return (

    <div className="form-field">

      <label>{label}</label>

      {children}

    </div>

  );

}


// ==========================================
// REUSABLE DETAIL ITEM
// ==========================================

function DetailItem({ icon, label, value }) {

  return (

    <div className="detail-item">

      <div className="detail-icon">

        {icon}

      </div>

      <div className="detail-content">

        <span>{label}</span>

        <strong>{value}</strong>

      </div>

    </div>

  );

}


export default Profile;