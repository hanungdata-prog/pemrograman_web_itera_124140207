import { useState, useEffect } from 'react'

function useLocalStorage(key, nilaiAwal) {
  const [nilai, setNilai] = useState(() => {
    try {
      const data = window.localStorage.getItem(key)
      return data ? JSON.parse(data) : nilaiAwal
    } catch (error) {
      console.error('Data localStorage rusak:', error)
      return nilaiAwal
    }
  })
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(nilai))
  }, [key, nilai])

  return [nilai, setNilai]
}

export default useLocalStorage
