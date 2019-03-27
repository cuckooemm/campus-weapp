const globalData = {}

export function setGolbal (key: string, val: any) {
  globalData[key] = val
}

export function getGolbal (key : string) :any {
  return globalData[key]
}