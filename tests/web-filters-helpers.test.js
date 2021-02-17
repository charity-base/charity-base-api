import {
  includesNumber,
  deconstructFilters,
  constructFilters,
} from "../components/filters/helpers"

describe("includesNumber", () => {
  test("is true if array contains number", () => {
    expect(includesNumber([1])).toBe(true)
  })

  test("is false if array only contains non-number types", () => {
    expect(includesNumber([null, undefined, "", "1", { a: 1 }])).toBe(false)
  })
})

describe("deconstructFilters", () => {
  test("empty filters yields valid ranges", () => {
    const { incomeRange, spendingRange, fundersRange } = deconstructFilters({})
    expect(incomeRange.length).toBe(2)
    expect(spendingRange.length).toBe(2)
    expect(fundersRange.length).toBe(2)
  })

  test("latestIncome query yields correct range", () => {
    const gte = 1000
    const lt = 123123123
    const { incomeRange } = deconstructFilters({
      finances: {
        latestIncome: { gte, lt },
      },
    })
    expect(incomeRange.length).toBe(2)
    expect(incomeRange[0]).toBe(gte)
    expect(incomeRange[1]).toBe(lt)
  })
})

describe("constructFilters", () => {
  test("undefined ranges yields empty filters object", () => {
    const filters = constructFilters({
      incomeRange: [undefined, undefined],
      spendingRange: [undefined, undefined],
      fundersRange: [undefined, undefined],
    })
    expect(Object.keys(filters).length).toBe(0)
  })

  test("incomeRange yields correct filters query", () => {
    const gte = 1000
    const lt = 123123123
    const { finances } = constructFilters({
      incomeRange: [gte, lt],
      spendingRange: [undefined, undefined],
      fundersRange: [undefined, undefined],
    })
    expect(finances.latestIncome.gte).toBe(gte)
    expect(finances.latestIncome.lt).toBe(lt)
  })
})
