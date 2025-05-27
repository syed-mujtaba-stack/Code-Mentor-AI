"use client";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/user-profile')
        .then(res => res.json())
        .then(data => {
          setBio(data.bio || '');
          setGoals(data.goals || '');
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    await fetch('/api/user-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, goals }),
    });
    alert('Profile updated!');
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200">
      <div className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-10 w-full max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-black drop-shadow-lg">Your Profile</h1>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black">Name</label>
          <div className="p-3 bg-indigo-50/60 rounded-lg text-lg font-medium text-black shadow-inner">{user.fullName || user.username}</div>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2 text-black">Bio</label>
          <textarea className="w-full border-2 border-fuchsia-200 focus:border-fuchsia-400 rounded-lg p-3 bg-white/80 shadow focus:outline-none transition text-black" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-black">Learning Goals</label>
          <textarea className="w-full border-2 border-pink-200 focus:border-pink-400 rounded-lg p-3 bg-white/80 shadow focus:outline-none transition text-black" value={goals} onChange={e => setGoals(e.target.value)} rows={3} />
        </div>
        <button className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-fuchsia-300 transition-all duration-200" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
