import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/home/Header';
import profileApi from '../api/profileApi';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressListModal, setShowAddressListModal] = useState(false);

  // Vietnam Provinces API state
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [addressForm, setAddressForm] = useState({
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });

  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  const userAvatar = profile?.avatarUrl || user?.avatarUrl || profile?.avatar || user?.avatar || defaultAvatar;
  const displayName = profile?.fullname || profile?.fullName || user?.fullName || user?.username || 'User';

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await res.json();
        setProvinces(data);
      } catch (e) {
        console.error('Failed to fetch provinces', e);
      }
    };
    fetchProvinces();

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
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { street, ward, district, city, isDefault } = addressForm;
      const res = await profileApi.addAddress({ street, ward, district, city, isDefault });
      if (res.success) {
        // Fetch lại toàn bộ profile để đảm bảo dữ liệu (bao gồm ID địa chỉ mới) đồng bộ với Server
        const profileRes = await profileApi.getProfile();
        if (profileRes.success && profileRes.result.addresses) {
          setAddresses(profileRes.result.addresses);
        }
        setShowAddressModal(false);
        setAddressForm({
          street: '',
          ward: '',
          district: '',
          city: '',
          isDefault: false
        });
      }
    } catch (error) {
      alert("Add address failed!");
    }
  };

  const handleUpdateAddress = async (id, updatedData) => {
    try {
      const res = await profileApi.updateAddress(id, updatedData);
      if (res.success) {
        setAddresses(addresses.map(addr => addr.id === id ? res.result : addr));
      }
    } catch (error) {
      alert("Update address failed!");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await profileApi.deleteAddress(id);
      if (res.success) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      }
    } catch (error) {
      alert("Delete address failed!");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const res = await profileApi.setDefaultAddress(id);
      if (res.success) {
        // Update all addresses locally: only one is default
        setAddresses(addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        })));
      }
    } catch (error) {
      alert("Set default address failed!");
    }
  };

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    const provinceName = provinces.find(p => p.code === parseInt(provinceCode))?.name || '';
    setAddressForm({ ...addressForm, city: provinceName, district: '', ward: '' });
    setWards([]);

    if (provinceCode) {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (e) {
        console.error('Failed to fetch districts', e);
      }
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const districtName = districts.find(d => d.code === parseInt(districtCode))?.name || '';
    setAddressForm({ ...addressForm, district: districtName, ward: '' });

    if (districtCode) {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await res.json();
        setWards(data.wards || []);
      } catch (e) {
        console.error('Failed to fetch wards', e);
      }
    } else {
      setWards([]);
    }
  };
  const handleCloseModal = () => {
    setShowAddressModal(false);
    setAddressForm({
      street: '',
      ward: '',
      district: '',
      city: '',
      isDefault: false
    });
    setDistricts([]);
    setWards([]);
    setActiveDropdown(null);
  };
  const [activeDropdown, setActiveDropdown] = useState(null);

  const CustomSelect = ({ label, options, value, onChange, disabled, placeholder }) => {
    const isOpen = activeDropdown === label;
    const selectedOption = options.find(opt => (opt.name || opt) === value);

    return (
      <div className="space-y-1 relative">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative group">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActiveDropdown(isOpen ? null : label)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white shadow-sm flex justify-between items-center disabled:bg-gray-100 disabled:opacity-60 cursor-pointer font-medium ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
          >
            <span className={!value ? 'text-gray-400' : 'text-gray-700'}>
              {value || placeholder}
            </span>
            <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-[70] max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 italic">No options available</div>
              ) : (
                options.map((opt) => {
                  const name = opt.name || opt;
                  const code = opt.code || opt;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChange({ target: { value: code } });
                        setActiveDropdown(null);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${value === name ? 'text-primary font-bold bg-primary/5' : 'text-gray-700'}`}
                    >
                      {name}
                      {value === name && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f5f5f5] text-on-surface-variant h-screen overflow-hidden">
      <Header />

      {/* Premium Header Banner */}
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-[#FF7A00] to-[#FF9E3D] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 -mt-16 md:-mt-20 relative z-10 pb-10 md:pb-4">
        {/* Top Profile Summary Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-5 md:p-6 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 border border-gray-50">
          <div className="relative group">
            <img 
              src={userAvatar} 
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[4px] md:border-[6px] border-white object-cover shadow-lg bg-white" 
              alt="User Avatar" 
            />
            <button className="absolute bottom-2 right-2 bg-white rounded-full p-2.5 shadow-lg border border-gray-100 text-gray-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
              <span className="material-symbols-outlined text-sm block">photo_camera</span>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{displayName}</h1>
            <p className="text-gray-500 mt-1 font-medium flex items-center justify-center md:justify-start gap-1">
              <span className="material-symbols-outlined text-sm">mail</span>
              {user?.email || 'No email associated'}
            </p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={() => setIsEditingProfile(true)} 
              className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 p-5 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Username</p>
                  <p className="font-semibold text-gray-900">{user?.username || 'user'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{profile?.fullname || profile?.fullName || user?.fullName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="font-semibold text-gray-900">{profile?.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                  <p className="font-semibold text-gray-900">
                    {profile?.gender === 'MALE' ? 'Male' : profile?.gender === 'FEMALE' ? 'Female' : profile?.gender === 'OTHER' ? 'Other' : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="font-semibold text-gray-900">{profile?.dateOfBirth || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Status</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Active
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Security</p>
                  <Link to="/change-password" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30 rounded-xl text-xs font-bold transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address Book */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 p-5 md:p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  Addresses
                </h3>
                <button 
                  onClick={() => setShowAddressListModal(true)}
                  className="text-primary text-sm font-bold hover:underline"
                >
                  Manage
                </button>
              </div>

              <div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-gray-300 text-3xl">location_off</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No addresses found.</p>
                    <button
                      onClick={() => {
                        setAddressForm({ ...addressForm, isDefault: true });
                        setShowAddressModal(true);
                      }}
                      className="bg-primary/10 text-primary px-5 py-2 rounded-xl font-bold text-sm transition-all hover:bg-primary/20 inline-flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Add New
                    </button>
                  </div>
                ) : (
                  <div className="group rounded-2xl p-4 bg-gray-50 border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-900">Default Address</span>
                      <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-bold shadow-sm">DEFAULT</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {(() => {
                        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
                        return defaultAddr ? `${defaultAddr.street}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.city}` : '';
                      })()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

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

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-heading">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Name</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white shadow-sm font-medium" defaultValue={profile?.fullname || user?.fullName} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                <input className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white shadow-sm font-medium" defaultValue={profile?.phone} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
                <div className="flex gap-6 mt-2 px-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="text-primary border-gray-300 focus:ring-primary w-4 h-4" name="edit_gender" type="radio" defaultChecked={profile?.gender === 'MALE'} />
                    <span className="text-sm font-medium text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="text-primary border-gray-300 focus:ring-primary w-4 h-4" name="edit_gender" type="radio" defaultChecked={profile?.gender === 'FEMALE'} />
                    <span className="text-sm font-medium text-gray-700">Female</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="text-primary border-gray-300 focus:ring-primary w-4 h-4" name="edit_gender" type="radio" defaultChecked={profile?.gender === 'OTHER'} />
                    <span className="text-sm font-medium text-gray-700">Other</span>
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date of Birth</label>
                <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white shadow-sm font-medium" defaultValue={profile?.dateOfBirth} />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50/50">
              <button onClick={() => setIsEditingProfile(false)} className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-all text-xs uppercase tracking-wider">Cancel</button>
              <button onClick={() => { alert('Profile update API integration pending'); setIsEditingProfile(false); }} className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all text-xs uppercase tracking-wider">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Address List Modal */}
      {showAddressListModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-heading">Manage Addresses</h3>
              <button onClick={() => setShowAddressListModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-grow bg-gray-50/30">
              {addresses.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No addresses found.</div>
              ) : (
                addresses.map((addr, index) => addr && (
                  <div key={addr.id || index} className="p-5 border border-gray-100 rounded-xl flex flex-col md:flex-row justify-between gap-4 hover:border-primary/30 transition-colors bg-white shadow-sm">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-[#333333]">{addr?.city || ''}</span>
                        {addr?.isDefault && (
                          <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">DEFAULT</span>
                        )}
                      </div>
                      <div className="text-sm text-[#666666] leading-relaxed">
                        {addr?.street}, {addr?.ward}, {addr?.district}, {addr?.city}
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="flex gap-4">
                        <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors" onClick={() => alert("Edit feature coming soon!")}>Edit</button>
                        <button className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                      </div>
                      {!addr?.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="border border-gray-200 px-3 py-1.5 rounded-[6px] text-xs font-bold text-[#666666] hover:bg-gray-50 transition-colors uppercase tracking-wider"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-5 border-t border-gray-100 bg-white">
              <button
                onClick={() => {
                  setShowAddressListModal(false);
                  setAddressForm({ ...addressForm, isDefault: addresses.length === 0 });
                  setShowAddressModal(true);
                }}
                className="w-full bg-primary text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:opacity-90 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add New Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading">New Address</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="p-6 space-y-4 bg-gray-50/30">


              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3">
                  <CustomSelect
                    label="Province / City"
                    placeholder="Select Province"
                    options={provinces}
                    value={addressForm.city}
                    onChange={handleProvinceChange}
                  />

                  <CustomSelect
                    label="District"
                    placeholder="Select District"
                    disabled={!addressForm.city}
                    options={districts}
                    value={addressForm.district}
                    onChange={handleDistrictChange}
                  />

                  <CustomSelect
                    label="Ward"
                    placeholder="Select Ward"
                    disabled={!addressForm.district}
                    options={wards}
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: wards.find(w => w.code === parseInt(e.target.value))?.name || '' })}
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Street Address</label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base bg-white shadow-sm font-medium"
                    placeholder="House number, street name..."
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="default-checkbox"
                  type="checkbox"
                  className="size-4 rounded text-primary focus:ring-primary border-gray-300"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                <label htmlFor="default-checkbox" className="text-sm text-gray-600 cursor-pointer">Set as default address</label>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white font-bold hover:opacity-90 shadow-lg shadow-primary/20 transition-all uppercase tracking-wider text-xs"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
