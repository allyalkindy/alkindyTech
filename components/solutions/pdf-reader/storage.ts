// Persists exactly one book in the browser's IndexedDB, under one fixed
// key. There is no library and no server upload: uploading a new PDF just
// overwrites this single slot, which is what lets a refresh resume the same
// book without us needing any object storage at all.

const DB_NAME = "pdf-reader"
const DB_VERSION = 1
const STORE_NAME = "book"
const BOOK_KEY = "current"

export interface StoredBook {
  fileName: string
  bytes: ArrayBuffer
  lastPage: number
  savedAt: number
}

// Cached rather than reopened per call: saveLastPage fires on every single
// page turn, and indexedDB.open() redoes a connection handshake each time
// even though it resolves async — reusing one open connection cuts that
// latency out of the page-turn path entirely. The connection is left open
// for the page's lifetime (IndexedDB connections are cheap to hold, and
// the browser itself closes them on tab close).
let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        dbPromise = null
        reject(request.error)
      }
    })
  }
  return dbPromise
}

export async function saveBook(fileName: string, bytes: ArrayBuffer, lastPage = 0): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const record: StoredBook = { fileName, bytes, lastPage, savedAt: Date.now() }
    // put() with the same fixed key overwrites whatever book was here
    // before — there is only ever one slot.
    tx.objectStore(STORE_NAME).put(record, BOOK_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function loadBook(): Promise<StoredBook | null> {
  const db = await openDb()
  return new Promise<StoredBook | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const request = tx.objectStore(STORE_NAME).get(BOOK_KEY)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
}

// Saved on every page turn so a refresh resumes where the user left off —
// deliberately NOT part of saveBook's write path, since re-writing the
// full PDF bytes on every single page flip would be wasteful.
export async function saveLastPage(page: number): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(BOOK_KEY)
    request.onsuccess = () => {
      const existing: StoredBook | undefined = request.result
      if (existing) {
        store.put({ ...existing, lastPage: page }, BOOK_KEY)
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function clearBook(): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).delete(BOOK_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
