import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({userInfo, onLogout}) => {
  return (
    <div className='order-2 md:order-3 flex  items-center md:gap-5 gap-2 md:text-left sm:text-center'>
      <div className='md:w-12 w-7 h-7 md:h-12 rounded-full bg-slate-300 flex items-center justify-center md:text-base text-xs'>{getInitials(userInfo?.name)}</div>
      <div>
        <p className='md:block hidden md:text-base text-xs text-slate-900'>{userInfo?.name}</p>
        <button onClick = {onLogout} className="underline text-slate-700 md:text-base text-xs">Logout</button>
      </div>
    </div>
  )
}

export default ProfileInfo