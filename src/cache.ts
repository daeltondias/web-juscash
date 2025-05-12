type CacheType = {
  fetchingRefreshToken: boolean
  // accessTokenExpiresAt: string
}

export const cache: CacheType = {
  fetchingRefreshToken: false,
  // accessTokenExpiresAt: '',
}
