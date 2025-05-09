import React from 'react'
import { Link } from 'react-router-dom'
function GetStartPage() {
  return (
    <div className='flex  justify-center'>
        <Link to="/home">
         <button className=' text-amber-500 h-20 w-20'>
            Next
        </button>
        </Link>
    </div>
  )
}

export default GetStartPage