export const isValidTikTokUrl = (link: string) => {
    const regex =
      /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\/.+/i
    return regex.test(link)
  }