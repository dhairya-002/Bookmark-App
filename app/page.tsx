'use client'

import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  getUser()

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })

  return () => {
    subscription.unsubscribe()
  }
}, [])

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={login}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return <Dashboard user={user} logout={logout} />
}

function Dashboard({ user, logout }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('realtime bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id,
    })

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="mb-6 space-y-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={addBookmark}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="p-4 border rounded flex justify-between"
          >
            <div>
              <a href={b.url} target="_blank" className="font-semibold">
                {b.title}
              </a>
              <p className="text-sm text-gray-500">{b.url}</p>
            </div>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}