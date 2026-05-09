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
  const [showAddressModal, setShowAddressModal] = useState(false);

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
              <button
                onClick={() => {
                  setAddressForm({
                    ...addressForm,
                    isDefault: addresses.length === 0
                  });
                  setShowAddressModal(true);
                }}
                className="bg-primary text-white px-6 py-2.5 rounded-[8px] font-medium text-sm transition-all flex items-center gap-2 shadow-sm hover:opacity-90"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add New Address
              </button>
            </div>
            <div className="space-y-4">
              {addresses.length === 0 ? (
                <p className="text-[#666666] text-sm py-4">No addresses found.</p>
              ) : (
                addresses.map((addr, index) => addr && (
                  <div key={addr.id || index} className="py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#333333]">{addr?.city || ''}</span>
                      </div>
                      <div className="text-sm text-[#666666]">
                        {addr?.street}, {addr?.ward}, {addr?.district}, {addr?.city}
                      </div>
                      {addr?.isDefault && (
                        <span className="inline-block border border-primary text-primary text-[10px] px-1.5 py-0.5 rounded-[2px] font-bold mt-2">DEFAULT</span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <button className="text-blue-500 text-sm hover:underline" type="button" onClick={() => alert("Edit address feature coming soon!")}>Edit</button>
                        <button className="text-blue-500 text-sm hover:underline" type="button" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                      </div>
                      <button
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="border border-gray-200 px-4 py-1.5 rounded-[8px] text-sm text-[#666666] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        type="button"
                        disabled={addr?.isDefault}
                      >
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
