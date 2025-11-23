'use client'

import { redirect } from "next/navigation"
import { useEffect } from "react"

function HomePage() {
  useEffect(() => {
    redirect('/auth/login');
  }, []);
  return (
    <div>HomePage</div>
  )
}

export default HomePage