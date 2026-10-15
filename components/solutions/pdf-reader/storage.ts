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

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
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
  db.close()
}

export async function loadBook(): Promise<StoredBook | null> {
  const db = await openDb()
  const result = await new Promise<StoredBook | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const request = tx.objectStore(STORE_NAME).get(BOOK_KEY)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
  db.close()
  return result
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
  db.close()
}

export async function clearBook(): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).delete(BOOK_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}
