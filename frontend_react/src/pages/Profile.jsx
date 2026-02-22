import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axio";

export default function Profile() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
  });
  const [originalForm, setOriginalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        const fullName = response.data?.name || "";
        const [firstName = "", ...restName] = fullName.trim().split(" ");

        const nextForm = {
          firstName,
          lastName: restName.join(" "),
          email: response.data?.email || "",
          phone: response.data?.phone || "",
          profilePicture: response.data?.profilePicture || "",
        };

        setForm(nextForm);
        setOriginalForm(nextForm);
      } catch (fetchError) {
        setError(fetchError.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();

      await api.put("/api/auth/profile", {
        name: fullName,
        email: form.email,
        phone: form.phone,
        profilePicture: form.profilePicture,
      });

      setOriginalForm(form);
      setSuccess("Profile updated successfully");
    } catch (saveError) {
      setError(saveError.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-orange-200">
      <Navbar />

      <div className="p-6">
        {error ? <p className="text-[#370A00] mb-4">{error}</p> : null}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 lg:grid-rows-4">
          <section className="bg-[#C26A2E] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-4 flex flex-col items-center text-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300">
              {form.profilePicture ? (
                <img
                  src={form.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            <p className="text-xl font-semibold">
              {form.firstName} {form.lastName}
            </p>
            <p className="break-all">{form.email}</p>

            <button className="w-full bg-[#FFD6A7] text-[#370A00] py-2 rounded-md">Profile Setting</button>
            <button className="w-full bg-[#FFD6A7] text-[#370A00] py-2 rounded-md">Change Password</button>
            <button className="w-full bg-[#FFD6A7] text-[#370A00] py-2 rounded-md">My Item</button>
          </section>

          <section className="bg-[#C26A2E] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-2">
            <h2 className="text-xl font-semibold mb-4">Profile Setting</h2>

            <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label>
                First Name
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-black"
                />
              </label>

              <label>
                Last Name
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-black"
                />
              </label>

              <label className="md:col-span-2">
                Email
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-black"
                />
              </label>

              <label className="md:col-span-2">
                Phone Number
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 text-black"
                />
              </label>

              <div className="md:col-span-2 flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#FFD6A7] text-[#370A00] px-4 py-2 rounded-md disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="text-white disabled:opacity-60"
                >
                  Cancel
                </button>
                {success ? <p className="text-[#370A00]">{success}</p> : null}
              </div>
            </form>
          </section>

          <section className="bg-[#C26A2E] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-1">
            <h2 className="text-xl font-semibold">Wish List</h2>
          </section>

          <section className="bg-[#C26A2E] text-[#370A00] rounded-xl shadow-md p-6 lg:row-span-1">
            <h2 className="text-xl font-semibold">History</h2>
          </section>
        </div>
      </div>
    </div>
  );
}