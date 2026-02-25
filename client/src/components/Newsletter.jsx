import React, { useState } from 'react'
import { toast } from 'react-toastify'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Subscribed Successfully!')
      setEmail('')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-8 my-10 mb-20 md:mb-40">

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        Never Miss a Deal!
      </h1>

      <p className="text-base md:text-lg text-gray-500/70 pb-6 md:pb-8 max-w-xl">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>

      <form onSubmit={onSubmitHandler} className="flex flex-col xs:flex-row items-center justify-center max-w-2xl w-full gap-2 xs:gap-0 h-auto xs:h-12 md:h-14">
        <input
          className="border border-gray-300 h-12 xs:h-full w-full px-4 text-gray-500 outline-none rounded-md xs:rounded-l-md xs:rounded-r-none xs:border-r-0"
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full xs:w-auto md:px-12 px-8 h-12 xs:h-full text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-md xs:rounded-r-md xs:rounded-l-none font-medium"
        >
          Subscribe
        </button>
      </form>

    </div>
  )
}

export default Newsletter
