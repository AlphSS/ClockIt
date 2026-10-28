import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  MapPin,
  IndianRupee,
  LoaderCircle,
  X,
  Save,
} from "lucide-react";

import NavBar from "../../components/common/NavBar";
import Footer from "../../components/common/Footer";
import {
  getMyRoomieListings,
  updateRoomieListing,
  deleteRoomieListing,
} from "../../services/roomieApi";

const initialEditForm = {
  title: "",
  description: "",
  location: "",
  listingType: "HAS_PLACE",
  bhk: "",
  monthlyRent: "",
  minBudget: "",
  maxBudget: "",
  availableFrom: "",
  roommatesNeeded: "1",
  furnishing: "",
};

function formatDate(date) {
  if (!date) return "Flexible move-in";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyRoomieListings() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [form, setForm] = useState(initialEditForm);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyRoomieListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load your Roomies listings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  function openEdit(listing) {
    setNotice("");
    setError("");
    setEditingListing(listing);

    setForm({
      title: listing.title || "",
      description: listing.description || "",
      location: listing.location || "",
      listingType: listing.listing_type || "HAS_PLACE",
      bhk: listing.bhk || "",
      monthlyRent: listing.monthly_rent ?? "",
      minBudget: listing.min_budget ?? "",
      maxBudget: listing.max_budget ?? "",
      availableFrom: listing.available_from || "",
      roommatesNeeded: listing.roommates_needed ?? "1",
      furnishing: listing.furnishing || "",
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editingListing) return;

    if (!form.title.trim() || !form.location.trim()) {
      setError("Listing title and location are required.");
      return;
    }

    setSavingId(editingListing.id);
    setError("");
    setNotice("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        listingType: form.listingType,
        bhk: form.bhk || null,
        monthlyRent: form.listingType === "HAS_PLACE" ? form.monthlyRent : null,
        minBudget:
          form.listingType === "LOOKING_FOR_PLACE" ? form.minBudget : null,
        maxBudget:
          form.listingType === "LOOKING_FOR_PLACE" ? form.maxBudget : null,
        availableFrom: form.availableFrom || null,
        roommatesNeeded:
          form.listingType === "HAS_PLACE" ? form.roommatesNeeded : null,
        furnishing: form.furnishing || null,
      };

      const updated = await updateRoomieListing(editingListing.id, payload);

      setListings((previous) =>
        previous.map((item) =>
          item.id === editingListing.id
            ? {
                ...item,
                ...(updated || {}),
                ...{
                  title: payload.title,
                  description: payload.description,
                  location: payload.location,
                  listing_type: payload.listingType,
                  bhk: payload.bhk,
                  monthly_rent: payload.monthlyRent,
                  min_budget: payload.minBudget,
                  max_budget: payload.maxBudget,
                  available_from: payload.availableFrom,
                  roommates_needed: payload.roommatesNeeded,
                  furnishing: payload.furnishing,
                },
              }
            : item,
        ),
      );

      setEditingListing(null);
      setNotice("Your listing has been updated.");
    } catch (err) {
      setError(err.message || "Unable to update this listing.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleStatusChange(listing, status) {
    setSavingId(listing.id);
    setError("");
    setNotice("");

    try {
      await updateRoomieListing(listing.id, { status });

      setListings((previous) =>
        previous.map((item) =>
          item.id === listing.id ? { ...item, status } : item,
        ),
      );

      setNotice("Listing status updated.");
    } catch (err) {
      setError(err.message || "Unable to update listing status.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(listing) {
    const confirmed = window.confirm(
      `Delete "${listing.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(listing.id);
    setError("");
    setNotice("");

    try {
      await deleteRoomieListing(listing.id);
      setListings((previous) =>
        previous.filter((item) => item.id !== listing.id),
      );
      setNotice("Listing deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete this listing.");
    } finally {
      setDeletingId(null);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#D8C9B5] bg-white px-3 py-2.5 text-sm text-[#280B0F] outline-none focus:border-[#8D3A3C]";

  return (
    <div className="min-h-screen bg-[#F5EEE6] text-[#280B0F]">
      <NavBar theme="roomies" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          to="/roomies"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#754247] hover:underline"
        >
          <ArrowLeft size={16} /> Back to Roomies
        </Link>

        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#D8C9B5] bg-[#FFF9F2] p-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8D3A3C]">
              CLOCKIT · ROOMIES
            </p>
            <h1 className="font-serif text-3xl font-bold">My Listings</h1>
            <p className="mt-2 text-sm text-[#796A61]">
              Manage your roommate and accommodation listings.
            </p>
          </div>

          <button
            onClick={() => navigate("/roomies/create")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8D3A3C] px-4 py-3 text-sm font-bold text-white hover:bg-[#713034]"
          >
            <Plus size={17} /> Create Listing
          </button>
        </header>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {notice && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#796A61]">
            <LoaderCircle className="animate-spin" size={20} />
            Loading your listings...
          </div>
        ) : listings.length === 0 ? (
          <section className="rounded-3xl border border-[#D8C9B5] bg-[#FFF9F2] px-5 py-16 text-center">
            <h2 className="font-serif text-2xl font-bold">
              No Roomies listings yet
            </h2>
            <p className="mx-auto mb-6 mt-2 max-w-md text-sm text-[#796A61]">
              Create a listing to find a roommate or connect with people
              searching for accommodation.
            </p>
            <button
              onClick={() => navigate("/roomies/create")}
              className="rounded-xl bg-[#8D3A3C] px-5 py-3 text-sm font-bold text-white"
            >
              Create your first listing
            </button>
          </section>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="rounded-2xl border border-[#D8C9B5] bg-[#FFF9F2] p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        listing.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : listing.status === "PAUSED"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {listing.status || "ACTIVE"}
                    </span>

                    <h2 className="mt-3 font-serif text-xl font-bold">
                      {listing.title}
                    </h2>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-[#796A61]">
                      <MapPin size={15} />
                      {listing.location || "Location not specified"}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#594A43]">
                      {listing.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-lg bg-[#F1E4D7] px-3 py-2">
                        {listing.listing_type === "HAS_PLACE"
                          ? "Has a place"
                          : "Looking for a place"}
                      </span>
                      {listing.bhk && (
                        <span className="rounded-lg bg-[#F1E4D7] px-3 py-2">
                          {listing.bhk}
                        </span>
                      )}
                      {listing.listing_type === "HAS_PLACE" &&
                        listing.monthly_rent != null && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#F1E4D7] px-3 py-2">
                            <IndianRupee size={13} />
                            {Number(listing.monthly_rent).toLocaleString(
                              "en-IN",
                            )}
                            /month
                          </span>
                        )}
                      {listing.listing_type === "LOOKING_FOR_PLACE" &&
                        listing.min_budget != null &&
                        listing.max_budget != null && (
                          <span className="rounded-lg bg-[#F1E4D7] px-3 py-2">
                            Budget: ₹{listing.min_budget}–₹{listing.max_budget}
                          </span>
                        )}
                      <span className="rounded-lg bg-[#F1E4D7] px-3 py-2">
                        Move-in: {formatDate(listing.available_from)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => openEdit(listing)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C9B5] px-3 py-2 text-sm font-semibold hover:bg-[#F1E4D7]"
                    >
                      <Edit2 size={15} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing)}
                      disabled={deletingId === listing.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingId === listing.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#E7DCCF] pt-4">
                  <label
                    htmlFor={`status-${listing.id}`}
                    className="text-sm font-semibold"
                  >
                    Listing status
                  </label>
                  <select
                    id={`status-${listing.id}`}
                    value={listing.status || "ACTIVE"}
                    disabled={savingId === listing.id}
                    onChange={(event) =>
                      handleStatusChange(listing, event.target.value)
                    }
                    className="rounded-lg border border-[#D8C9B5] bg-white px-3 py-2 text-sm"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  {savingId === listing.id && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer theme="roomies" />

      {editingListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <section className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#FFF9F2] p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8D3A3C]">
                  Edit Roomies Listing
                </p>
                <h2 className="mt-1 font-serif text-2xl font-bold">
                  Update your details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingListing(null)}
                aria-label="Close edit form"
                className="rounded-lg p-2 hover:bg-[#F1E4D7]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Listing type
                </label>
                <select
                  name="listingType"
                  value={form.listingType}
                  onChange={handleFormChange}
                  className={inputClass}
                >
                  <option value="HAS_PLACE">I have a place</option>
                  <option value="LOOKING_FOR_PLACE">
                    I'm looking for a place
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Title *
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  maxLength={120}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Location *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleFormChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    BHK
                  </label>
                  <input
                    name="bhk"
                    value={form.bhk}
                    onChange={handleFormChange}
                    placeholder="e.g. 2 BHK"
                    className={inputClass}
                  />
                </div>

                {form.listingType === "HAS_PLACE" ? (
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Monthly rent (₹)
                    </label>
                    <input
                      name="monthlyRent"
                      type="number"
                      min="0"
                      value={form.monthlyRent}
                      onChange={handleFormChange}
                      className={inputClass}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">
                        Minimum budget (₹)
                      </label>
                      <input
                        name="minBudget"
                        type="number"
                        min="0"
                        value={form.minBudget}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">
                        Maximum budget (₹)
                      </label>
                      <input
                        name="maxBudget"
                        type="number"
                        min="0"
                        value={form.maxBudget}
                        onChange={handleFormChange}
                        className={inputClass}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Available from
                  </label>
                  <input
                    name="availableFrom"
                    type="date"
                    value={form.availableFrom}
                    onChange={handleFormChange}
                    className={inputClass}
                  />
                </div>

                {form.listingType === "HAS_PLACE" && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold">
                      Roommates needed
                    </label>
                    <input
                      name="roommatesNeeded"
                      type="number"
                      min="1"
                      value={form.roommatesNeeded}
                      onChange={handleFormChange}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Furnishing
                </label>
                <select
                  name="furnishing"
                  value={form.furnishing}
                  onChange={handleFormChange}
                  className={inputClass}
                >
                  <option value="">Not specified</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-[#E7DCCF] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
                  className="rounded-xl border border-[#D8C9B5] px-4 py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingId === editingListing.id}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8D3A3C] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  <Save size={16} />
                  {savingId === editingListing.id
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
