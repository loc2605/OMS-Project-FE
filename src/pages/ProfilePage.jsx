import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import profileApi from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  const userAvatar = profile?.avatarUrl || user?.avatarUrl || profile?.avatar || user?.avatar || defaultAvatar;
  const displayName = profile?.fullname || profile?.fullName || user?.fullName || user?.username || 'User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await profileApi.getProfile();
        if (profileRes.success) {
          setProfile(profileRes.result);
          // If addresses are included in profile result, use them
          if (profileRes.result.addresses) {
            setAddresses(profileRes.result.addresses);
          }
        }

        // Try to fetch addresses separately if needed, but don't let it crash the profile
        try {
          const addressRes = await profileApi.getAddresses();
          if (addressRes.success) setAddresses(addressRes.result);
        } catch (addrError) {
          console.warn('Failed to fetch addresses separately', addrError);
        }
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddAddress = async () => {
    const newAddress = {
      street: "123 Le Loi",
      ward: "Ben Nghe",
      district: "Quan 1",
      city: "Ho Chi Minh",
      receiverName: profile?.fullname || user?.fullName || "Nguyen Van A",
      receiverPhone: profile?.phone || "0901234567",
      isDefault: addresses.length === 0
    };
    try {
      const res = await profileApi.addAddress(newAddress);
      if (res.success) {
        setAddresses([...addresses, res.result]);
      }
    } catch (error) {
      alert("Add address failed!");
    }
  };

  return (
    <div className="bg-background text-on-surface-variant min-h-screen">
      <Header />

      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8 flex flex-col md:flex-row gap-8">
        <aside className="md:w-60 flex-shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 mb-8">
              <img
                alt="User profile picture"
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
                src={userAvatar}
              />
              <div className="overflow-hidden">
                <p className="text-[#333333] font-bold text-sm truncate">{displayName}</p>
                <button className="text-[#666666] text-xs flex items-center gap-1 hover:text-primary" type="button">
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Edit Profile
                </button>
              </div>
            </div>
            <nav className="space-y-4">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 px-2 py-1 text-primary font-medium text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  My Account
                </button>
                <div className="ml-8 space-y-3">
                  <button type="button" onClick={() => navigate('/profile')} className="block text-sm text-primary">
                    Profile
                  </button>
                  <button type="button" className="block text-sm text-[#666666] hover:text-primary">
                    Banks &amp; Cards
                  </button>
                  <button type="button" className="block text-sm text-[#666666] hover:text-primary">
                    Addresses
                  </button>
                  <button type="button" className="block text-sm text-[#666666] hover:text-primary">
                    Change Password
                  </button>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/orders')}
                className="flex items-center gap-3 px-2 py-1 text-[#666666] hover:text-primary font-medium text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                My Purchase
              </button>
              <button type="button" className="flex items-center gap-3 px-2 py-1 text-[#666666] hover:text-primary font-medium text-sm transition-colors">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                Notifications
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-grow space-y-8 pb-20 md:pb-0">
          <section className="bg-white rounded-[8px] shadow-sm p-8 transition-all">
            <div className="border-b border-gray-100 pb-6 mb-8">
              <h2 className="text-lg font-bold text-[#333333]">My Profile</h2>
              <p className="text-[#666666] text-sm mt-1">Manage and protect your account</p>
            </div>
            <div className="flex flex-col-reverse lg:flex-row gap-16">
              <div className="flex-grow space-y-6">
                <div className="grid grid-cols-1 gap-6 max-w-2xl">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Username</label>
                    <span className="text-sm text-[#333333]">{user?.username || 'user'}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Name</label>
                    <span className="text-sm text-[#333333]">{profile?.fullname || profile?.fullName || user?.fullName || ''}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Email</label>
                    <div className="flex-grow flex items-center justify-between">
                      <span className="text-sm text-[#333333]">{user?.email || 'email@example.com'}</span>
                      <button className="text-blue-500 text-sm hover:underline" type="button">
                        Change
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Phone Number</label>
                    <div className="flex-grow flex items-center justify-between">
                      <span className="text-sm text-[#333333]">{profile?.phone || 'Not set'}</span>
                      <button className="text-blue-500 text-sm hover:underline" type="button">
                        Change
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Gender</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" name="gender" type="radio" defaultChecked={profile?.gender === 'MALE'} />
                        <span className="text-sm text-[#333333]">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" name="gender" type="radio" defaultChecked={profile?.gender === 'FEMALE'} />
                        <span className="text-sm text-[#333333]">Female</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" name="gender" type="radio" defaultChecked={profile?.gender === 'OTHER'} />
                        <span className="text-sm text-[#333333]">Other</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="md:w-32 text-sm text-[#666666] md:text-right">Date of Birth</label>
                    <div className="flex-grow flex items-center gap-2">
                      <span className="text-sm text-[#333333]">{profile?.dateOfBirth || 'Not set'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
                    <div className="md:w-32"></div>
                    <button className="bg-primary text-white px-8 py-2.5 rounded-[8px] font-medium shadow-sm hover:opacity-90 active:opacity-100 transition-all" type="button">
                      Save
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:w-72 flex flex-col items-center lg:border-l lg:border-gray-100 py-4">
                <div className="relative mb-6">
                  <img
                    alt="User profile avatar large"
                    className="w-24 h-24 rounded-full object-cover border border-gray-100 shadow-sm"
                    src={userAvatar}
                  />
                </div>
                <button className="border border-gray-200 px-5 py-2 rounded-[8px] text-sm text-[#666666] hover:bg-gray-50 transition-colors" type="button">
                  Select Image
                </button>
                <div className="mt-4 text-center">
                  <p className="text-[#999999] text-xs leading-relaxed">
                    File size: maximum 1 MB
                    <br />
                    Extension: .JPEG, .PNG
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[8px] shadow-sm p-8 transition-all">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-lg font-bold text-[#333333]">My Addresses</h2>
                <p className="text-[#666666] text-sm mt-1">Shipping locations for your orders</p>
              </div>
              <button onClick={handleAddAddress} className="bg-primary text-white px-6 py-2.5 rounded-[8px] font-medium text-sm transition-all flex items-center gap-2 shadow-sm hover:opacity-90" type="button">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add Mock Address
              </button>
            </div>
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <p className="text-[#666666] text-sm py-4">No addresses found.</p>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className="py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold border-r border-gray-300 pr-3 text-[#333333]">{addr.receiverName || 'User'}</span>
                        <span className="text-sm text-[#666666]">{addr.receiverPhone || ''}</span>
                      </div>
                      <div className="text-sm text-[#666666]">
                        {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                      </div>
                      {addr.isDefault && (
                        <span className="inline-block border border-primary text-primary text-[10px] px-1.5 py-0.5 rounded-[2px] font-bold mt-2">DEFAULT</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-500 text-sm hover:underline" type="button">Edit</button>
                        <button className="text-blue-500 text-sm hover:underline" type="button">Delete</button>
                      </div>
                      <button className="border border-gray-200 px-4 py-1.5 rounded-[8px] text-sm text-[#666666] disabled:opacity-50 disabled:cursor-not-allowed" type="button" disabled={addr.isDefault}>
                        Set as Default
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white border-t border-gray-100 shadow-lg">
        <button type="button" className="flex flex-col items-center justify-center text-[#666666] px-4 py-1">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase mt-1">Home</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-[#666666] px-4 py-1">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-bold uppercase mt-1">Search</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-[#666666] px-4 py-1">
          <span className="material-symbols-outlined">package</span>
          <span className="text-[10px] font-bold uppercase mt-1">Orders</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-primary px-4 py-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-[10px] font-bold uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default ProfilePage;
