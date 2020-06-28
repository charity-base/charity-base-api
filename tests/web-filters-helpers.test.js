import { includesNumber } from "../components/filters/helpers"

describe("includesNumber", () => {
  test("is true if array contains number", () => {
    expect(includesNumber([1])).toBe(true)
  })

  test("is false if array contains non-number types", () => {
    expect(includesNumber([null, undefined, "", "1", { a: 1 }])).toBe(false)
  })
})
