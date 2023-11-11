import { toString } from 'lodash-es'
import accounting from "accounting"
import dateParser from "any-date-parser"

class ValidationAbortError extends Error {
  constructor(message: string, readonly value: any) {
    super(message)
  }
}

export function value(path: string) {
  return (state: ValidationState) => {
    const val = state.data[path]
    state.originalData[state.parsingKey!] = val

    if (typeof val === 'undefined') {
      throw new ValidationAbortError(`No '${path}' data was present for this employee`, val)
    }

    return val
  }
}

export function number(path: string) {
  return (state: ValidationState) => {
    const val = value(path)(state)

    if (typeof val === 'number') {
      return val
    } else {
      state.warn(`Expected number for '${path}', got ${typeof val}`)

      const num = parseFloat(val)

      if (isNaN(num)) {
        state.error(`Couldn't determine numeric value from ${val}`)
        return val
      }

      return num
    }
  }
}

export function int(path: string) {
  return (state: ValidationState) => {
    const num = number(path)(state)

    if (!Number.isInteger(num)) {
      state.warn(`Expected integer for '${path}', got ${num}`)
    }

    return num
  }
}

export function string(path: string) {
  return (state: ValidationState) => {
    const val = value(path)(state)

    if (typeof val === 'string') {
      return val
    } else {
      state.warn(`Expected string for '${path}', got ${typeof val}`)
      return toString(val)
    }
  }
}

export function salary(path: string) {
  return (state: ValidationState) => {
    let val = string(path)(state)

    let num = accounting.unformat(val)

    if (val.includes("$")) {
      state.warn(`Original value was in $, USD was assumed and value multipled by exchange rate of 0.94`)
      num *= 0.94
    } else if (!val.includes("€")) {
      state.warn(`Salary did not include a currency marker, EUR was assumed`)
    }

    return num
  }
}

export function date(path: string) {
  return (state: ValidationState) => {
    let val = string(path)(state)

    // XXX hardcoding a workaround for this format inconsistency between
    // birthday and entry_date, don't have time for proper solution
    if (path === 'entry_date' && val.match(/\d{2}\/\d{2}\/\d{4}/)) {
      val = val.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")
    }

    const m2 = val.match(/(\d{2})\.(\d{2})\.(\d{2})/)
    if (m2) {
      // Swap mm.dd.yy into the dd.mm.yy format which parser knows
      val = `${m2[2]}/${m2[1]}/${m2[3]}`
    }

    const date = dateParser.attempt(val)

    if (!date.day || !date.month || !date.year) {
      state.error(`Failed to parse date from '${val}'`)
      return val
    }

    // Use sortable intermediary ISO format
    return `${date.year}-${toString(date.month).padStart(2, '0')}-${toString(date.day).padStart(2, '0')}`
  }
}

export function schema(def: any) {
  return {
    parse: (data: any) => {
      return new ValidationState(def, data).parse()
    }
  }
}

export class ValidationState {
  problems: Record<string, { severity: 'warn' | 'error', message: string }[]> = {}
  originalData: Record<string, unknown> = {}
  parsingKey: string | null = null

  constructor(readonly def: Record<string, (state: ValidationState) => any>, readonly data: any) { }

  log(message: string, severity: 'warn' | 'error') {
    if (!this.parsingKey) {
      throw new Error(`Tried to warn outside of parse`)
    }

    if (!this.problems[this.parsingKey]) {
      this.problems[this.parsingKey] = []
    }

    this.problems[this.parsingKey].push({
      severity,
      message
    })
  }

  warn(message: string) {
    this.log(message, 'warn')
  }

  error(message: string) {
    this.log(message, 'error')
  }

  parse() {
    const data: any = {}

    for (const [key, fn] of Object.entries(this.def)) {
      this.parsingKey = key
      try {
        data[key] = fn(this)
      } catch (err: unknown) {
        if (err instanceof ValidationAbortError) {
          this.error(err.message)
          data[key] = err.value
        } else {
          throw err
        }
      }
      this.parsingKey = null
    }


    return {
      data,
      problems: this.problems,
      originalData: this.originalData
    }
  }
}