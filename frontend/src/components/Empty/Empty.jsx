import React from 'react'

const Empty = ({ imgSrc, message }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-5 max-w-[500px] mx-auto mt-20'>
        <img src={imgSrc} alt={message} className='w-[200px]' />

        <p className="text-lg text-slate-700 text-center">{message}</p>
    </div>
  )
}

export default Empty