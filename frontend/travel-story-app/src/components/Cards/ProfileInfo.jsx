import React from 'react';
import { getInitials } from '../../utils/helper';

function ProfileInfo({ userInfo, onLogout }) { // ✅ Fixed function declaration
  return (
    userInfo && (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo ? userInfo.fullName : "")}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo.fullName || ""}</p> {/* ✅ Fixed className syntax */}
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
    )
  );
}

export default ProfileInfo;
