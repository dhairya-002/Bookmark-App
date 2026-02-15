// 'use client'

// import { supabase } from '../lib/supabase'
// import { useEffect, useState } from 'react'

// export default function Home() {
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//   const getUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     setUser(user)
//   }

//   getUser()

//   const {
//     data: { subscription },
//   } = supabase.auth.onAuthStateChange((_event, session) => {
//     setUser(session?.user ?? null)
//   })

//   return () => {
//     subscription.unsubscribe()
//   }
// }, [])

//   const login = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//     })
//   }

//   const logout = async () => {
//     await supabase.auth.signOut()
//   }

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <button
//           onClick={login}
//           className="px-6 py-3 bg-black text-white rounded-lg"
//         >
//           Sign in with Google
//         </button>
//       </div>
//     )
//   }

//   return <Dashboard user={user} logout={logout} />
// }

// function Dashboard({ user, logout }: any) {
//   const [bookmarks, setBookmarks] = useState<any[]>([])
//   const [title, setTitle] = useState('')
//   const [url, setUrl] = useState('')
// // In your component
// useEffect(() => {
//   if (!user) return;

//   const channel = supabase
//     .channel('bookmarks-changes')
//     .on(
//       'postgres_changes',
//       {
//         event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
//         schema: 'public',
//         table: 'bookmarks',
//         filter: `user_id=eq.${user.id}` // Only listen to current user's bookmarks
//       },
//       (payload) => {
//         console.log('Realtime payload:', payload);
        
//         if (payload.eventType === 'INSERT') {
//           setBookmarks((current) => [...current, payload.new]);
//         } else if (payload.eventType === 'DELETE') {
//           setBookmarks((current) => 
//             current.filter((b) => b.id !== payload.old.id)
//           );
//         }
//       }
//     )
//     .subscribe((status) => {
//       console.log('Realtime status:', status);
//     });

//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, [user]);



//   const fetchBookmarks = async () => {
//     const { data } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .order('created_at', { ascending: false })

//     setBookmarks(data || [])
//   }

//   const addBookmark = async () => {
//     if (!title || !url) return

//     await supabase.from('bookmarks').insert({
//       title,
//       url,
//       user_id: user.id,
//     })

//     setTitle('')
//     setUrl('')
//   }

//   const deleteBookmark = async (id: string) => {
//     await supabase.from('bookmarks').delete().eq('id', id)
//   }

//   return (
//     <div className="p-10 max-w-2xl mx-auto">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold">My Bookmarks</h1>
//         <button onClick={logout} className="text-red-500">
//           Logout
//         </button>
//       </div>

//       <div className="mb-6 space-y-2">
//         <input
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <input
//           placeholder="URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <button
//           onClick={addBookmark}
//           className="w-full bg-blue-600 text-white py-2 rounded"
//         >
//           Add Bookmark
//         </button>
//       </div>

//       <div className="space-y-3">
//         {bookmarks.map((b) => (
//           <div
//             key={b.id}
//             className="p-4 border rounded flex justify-between"
//           >
//             <div>
//               <a href={b.url} target="_blank" className="font-semibold">
//                 {b.title}
//               </a>
//               <p className="text-sm text-gray-500">{b.url}</p>
//             </div>
//             <button
//               onClick={() => deleteBookmark(b.id)}
//               className="text-red-500"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
// //       </div>
// //     </div>
// //   )
// // }


// 'use client'

// import { supabase } from '../lib/supabase'
// import { useEffect, useState } from 'react'

// export default function Home() {
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setUser(user)
//     }

//     getUser()

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

//   const login = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: window.location.origin
//       }
//     })
//   }

//   const logout = async () => {
//     await supabase.auth.signOut()
//   }

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <button
//           onClick={login}
//           className="px-6 py-3 bg-black text-white rounded-lg"
//         >
//           Sign in with Google
//         </button>
//       </div>
//     )
//   }

//   return <Dashboard user={user} logout={logout} />
// }

// function Dashboard({ user, logout }: any) {
//   const [bookmarks, setBookmarks] = useState<any[]>([])
//   const [title, setTitle] = useState('')
//   const [url, setUrl] = useState('')
//   const [loading, setLoading] = useState(true)

//   // Fetch bookmarks on mount
//   useEffect(() => {
//     fetchBookmarks()
//   }, [user])

//   // Set up Realtime subscription AFTER initial fetch
//   useEffect(() => {
//     if (!user) return

//     console.log('Setting up Realtime for user:', user.id)

//     const channel = supabase
//       .channel(`bookmarks-${user.id}`) // Unique channel per user
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'bookmarks',
//           filter: `user_id=eq.${user.id}`
//         },
//         (payload) => {
//           console.log('Realtime event received:', payload)
          
//           if (payload.eventType === 'INSERT') {
//             setBookmarks((current) => [payload.new as any, ...current])
//           } else if (payload.eventType === 'DELETE') {
//             setBookmarks((current) => 
//               current.filter((b) => b.id !== payload.old.id)
//             )
//           } else if (payload.eventType === 'UPDATE') {
//             setBookmarks((current) =>
//               current.map((b) => b.id === payload.new.id ? payload.new as any : b)
//             )
//           }
//         }
//       )
//       .subscribe((status) => {
//         console.log('Realtime subscription status:', status)
//       })

//     return () => {
//       console.log('Cleaning up Realtime subscription')
//       supabase.removeChannel(channel)
//     }
//   }, [user])

//   const fetchBookmarks = async () => {
//     setLoading(true)
//     const { data, error } = await supabase
//       .from('bookmarks')
//       .select('*')
//       .eq('user_id', user.id)
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error('Error fetching bookmarks:', error)
//     } else {
//       console.log('Fetched bookmarks:', data)
//       setBookmarks(data || [])
//     }
//     setLoading(false)
//   }

//   const addBookmark = async () => {
//     if (!title || !url) return

//     const { error } = await supabase.from('bookmarks').insert({
//       title,
//       url,
//       user_id: user.id,
//     })

//     if (error) {
//       console.error('Error adding bookmark:', error)
//       alert('Failed to add bookmark')
//     } else {
//       setTitle('')
//       setUrl('')
//     }
//   }

//   const deleteBookmark = async (id: string) => {
//     const { error } = await supabase
//       .from('bookmarks')
//       .delete()
//       .eq('id', id)
//       .eq('user_id', user.id) // Extra security check

//     if (error) {
//       console.error('Error deleting bookmark:', error)
//       alert('Failed to delete bookmark')
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div>Loading...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-10 max-w-2xl mx-auto">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold">My Bookmarks</h1>
//         <button onClick={logout} className="text-red-500">
//           Logout
//         </button>
//       </div>

//       <div className="mb-6 space-y-2">
//         <input
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <input
//           placeholder="URL"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="w-full border p-2 rounded"
//         />
//         <button
//           onClick={addBookmark}
//           className="w-full bg-blue-600 text-white py-2 rounded"
//         >
//           Add Bookmark
//         </button>
//       </div>

//       <div className="space-y-3">
//         {bookmarks.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No bookmarks yet. Add one above!</p>
//         ) : (
//           bookmarks.map((b) => (
//             <div
//               key={b.id}
//               className="p-4 border rounded flex justify-between items-start"
//             >
//               <div>
//                 <a 
//                   href={b.url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="font-semibold hover:text-blue-600"
//                 >
//                   {b.title}
//                 </a>
//                 <p className="text-sm text-gray-500 break-all">{b.url}</p>
//               </div>
//               <button
//                 onClick={() => deleteBookmark(b.id)}
//                 className="text-red-500 hover:text-red-700 ml-4"
//               >
//                 Delete
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }


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
      options: {
        redirectTo: window.location.origin
      }
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
  const [loading, setLoading] = useState(true)

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks()
  }, [])

  // Polling fallback (works even if Realtime fails)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBookmarks()
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Try Realtime with presence (more stable than postgres_changes)
  useEffect(() => {
    if (!user) return

    const channel = supabase.channel(`room:${user.id}`, {
      config: {
        broadcast: { self: true }
      }
    })

    channel
      .on('broadcast', { event: 'bookmark-update' }, () => {
        console.log('Received broadcast, refreshing...')
        fetchBookmarks()
      })
      .subscribe((status) => {
        console.log('Channel status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to Realtime')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchBookmarks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
    setLoading(false)
  }

  const broadcastChange = async () => {
    try {
      await supabase.channel(`room:${user.id}`).send({
        type: 'broadcast',
        event: 'bookmark-update',
        payload: {}
      })
    } catch (err) {
      console.log('Broadcast failed, relying on polling')
    }
  }

  const addBookmark = async () => {
    if (!title || !url) return

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: user.id,
    })

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Failed to add bookmark')
    } else {
      setTitle('')
      setUrl('')
      await fetchBookmarks()
      await broadcastChange()
    }
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    } else {
      await fetchBookmarks()
      await broadcastChange()
    }
  }

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    )
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
          onKeyDown={(e) => e.key === 'Enter' && addBookmark()}
        />
        <button
          onClick={addBookmark}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-3">
        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookmarks yet. Add one above!</p>
        ) : (
          bookmarks.map((b) => (
            <div
              key={b.id}
              className="p-4 border rounded flex justify-between items-start hover:bg-gray-50"
            >
              <div className="flex-1">
                <a 
                  href={b.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-blue-600 block"
                >
                  {b.title}
                </a>
                <p className="text-sm text-gray-500 break-all mt-1">{b.url}</p>
              </div>
              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 hover:text-red-700 ml-4 px-2"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}