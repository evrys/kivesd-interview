import * as v from './validation'

// {
//     "id": 128,
//     "pk_dataset": "CEE7D98B-A5CA-4A16-4772-ED850A86B095",
//     "name": "Sybill A. Mcgee",
//     "country": "Sint Maarten",
//     "region": "Pays de la Loire",
//     "latlng": "-67.3217826816, -29.0963008512",
//     "personal_quote": "semper, dui lectus rutrum urna, nec luctus felis",
//     "salary": "€125,044",
//     "birthday": "16/04/2023",
//     "entry_date": "November 23rd, 2023",
//     "address": "8722 Proin Road",
//     "phone": "1-387-316-7764",
//     "experience_score": 9,
//     "favorite_food": "sandwiches, salads"
//   }

export type Employee = {
  id: number
  pkDataset: string
  name: string
  country: string
  region: string
  latlng: string
  personalQuote: string
  salaryEuros: number
  birthday: string
  entryDate: string
  address: string
  phone: string
  experienceScore: number
  favoriteFood: string
  status: 'ok' | 'warn' | 'error'
  problems: Record<string, { severity: 'warn' | 'error', message: string }[]>
  originalData: Record<string, unknown>
}

export type EmployeeColumnDef = {
  label: string
  key: keyof Employee
  displayed: boolean
  padding: number
  sortable?: true
  searchable?: true
  summable?: true
  format?: (value: any) => string
}


const employeeSchema = v.schema({
  id: v.int('id'),
  pkDataset: v.string('pk_dataset'),
  name: v.string('name'),
  country: v.string('country'),
  region: v.string('region'),
  latlng: v.string('latlng'),
  personalQuote: v.string('personal_quote'),
  salaryEuros: v.salary('salary'),
  birthday: v.date('birthday'),
  entryDate: v.date('entry_date'),
  address: v.string('address'),
  phone: v.string('phone'),
  experienceScore: v.number('experience_score'),
  favoriteFood: v.string('favorite_food'),
})

export function parseAndCleanEmployeeData(rawData: unknown[]): Employee[] {
  const employees: Employee[] = []

  for (const row of rawData) {
    const { data, problems, originalData } = employeeSchema.parse(row)

    employees.push({
      ...data,
      problems,
      originalData
    })
  }

  return employees
}