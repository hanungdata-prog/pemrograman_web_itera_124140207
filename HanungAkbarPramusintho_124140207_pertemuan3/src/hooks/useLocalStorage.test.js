import { renderHook, act } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('menyimpan perubahan data ke localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('data_test', []))

    act(() => {
      result.current[1](['buku pertama'])
    })

    expect(result.current[0]).toEqual(['buku pertama'])
    expect(JSON.parse(localStorage.getItem('data_test'))).toEqual(['buku pertama'])
  })

  test('membaca data yang sudah tersimpan sebelumnya', () => {
    localStorage.setItem('data_test', JSON.stringify(['tersimpan']))
    const { result } = renderHook(() => useLocalStorage('data_test', []))
    expect(result.current[0]).toEqual(['tersimpan'])
  })
})
