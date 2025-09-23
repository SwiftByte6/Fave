"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/products";

interface ProfileRow {
  id?: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  country?: string;
  created_at?: string;
}

const AccountPage: React.FC = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const defaultCountry = "India";

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, name, email, phone, address, city, pincode, country, created_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
    }

    if (data) {
      setProfile(data as ProfileRow);
    } else {
      // initialize from Clerk if empty
      setProfile({
        user_id: user.id,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        country: defaultCountry,
      });
    }
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    loadProfile();
  }, [user?.id, loadProfile]);

  const onChange = (field: keyof ProfileRow, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const canSave = useMemo(() => !!profile && !!profile.user_id, [profile]);

  const onSave = async () => {
    if (!canSave || !profile) return;
    setIsSaving(true);
    const payload: ProfileRow = {
      user_id: profile.user_id,
      name: profile.name?.trim() || null as any,
      email: profile.email?.trim() || null as any,
      phone: profile.phone?.trim() || null as any,
      address: profile.address?.trim() || null as any,
      city: profile.city?.trim() || null as any,
      pincode: profile.pincode?.trim() || null as any,
      country: profile.country?.trim() || defaultCountry,
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .maybeSingle();

    if (error) {
      console.error(error);
      setIsSaving(false);
      return;
    }
    setProfile(data as ProfileRow);
    setIsSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Your Profile</h1>

      <SignedOut>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="mb-4 text-gray-600">Please sign in to manage your profile.</p>
          <SignInButton>
            <button className="text-sm font-medium px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition">Sign In</button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {isLoading || !profile ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 border border-[#F0E7DE]">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Full Name</label>
                <input
                  value={profile.name || ""}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Email</label>
                <input
                  value={profile.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Phone</label>
                <input
                  value={profile.phone || ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Address</label>
                <textarea
                  value={profile.address || ""}
                  onChange={(e) => onChange("address", e.target.value)}
                  className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  rows={3}
                  placeholder="Street, Area"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#8A6F5C] mb-1">City</label>
                  <input
                    value={profile.city || ""}
                    onChange={(e) => onChange("city", e.target.value)}
                    className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Pincode</label>
                  <input
                    value={profile.pincode || ""}
                    onChange={(e) => onChange("pincode", e.target.value)}
                    className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8A6F5C] mb-1">Country</label>
                  <input
                    value={profile.country || defaultCountry}
                    onChange={(e) => onChange("country", e.target.value)}
                    className="w-full border border-[#F0E7DE] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">Last updated: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}</div>
              <button
                onClick={onSave}
                disabled={isSaving || !canSave}
                className={`px-6 py-2 rounded-full font-semibold text-white transition ${isSaving ? 'bg-pink-300' : 'bg-pink-600 hover:bg-pink-700'}`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default AccountPage;


