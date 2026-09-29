import { Mp3Encoder } from "@breezystack/lamejs"

// Kept loosely typed on purpose — mixing the "dom" and "webworker" TS libs
// in one project is a well-known source of conflicting global type errors,
// and this file only needs postMessage/onmessage, not the full worker lib.
/* eslint-disable @typescript-eslint/no-explicit-any */
const ctx: any = self

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return output
}

interface EncodeRequest {
  channels: number
  sampleRate: number
  kbps: number
  left: Float32Array
  right: Float32Array | null
}

ctx.onmessage = (event: MessageEvent<EncodeRequest>) => {
  const { channels, sampleRate, kbps, left, right } = event.data
  try {
    const encoder = new Mp3Encoder(channels, sampleRate, kbps)
    const blockSize = 1152
    const leftInt16 = floatTo16BitPCM(left)
    const rightInt16 = right ? floatTo16BitPCM(right) : null
    const chunks: Uint8Array[] = []
    const total = leftInt16.length

    let lastReported = 0
    for (let i = 0; i < total; i += blockSize) {
      const l = leftInt16.subarray(i, i + blockSize)
      const buf = rightInt16
        ? encoder.encodeBuffer(l, rightInt16.subarray(i, i + blockSize))
        : encoder.encodeBuffer(l)
      if (buf.length > 0) chunks.push(buf)

      if (i - lastReported > blockSize * 300) {
        lastReported = i
        ctx.postMessage({ type: "progress", value: i / total })
      }
    }
    const end = encoder.flush()
    if (end.length > 0) chunks.push(end)

    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }

    ctx.postMessage({ type: "done", data: result }, [result.buffer])
  } catch (err) {
    ctx.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : "Encoding failed.",
    })
  }
}

export {}
