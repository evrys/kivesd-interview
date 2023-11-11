<script setup lang="ts">
import { defineState } from 'vue-define-state'
import type { Employee, EmployeeColumnDef } from '../utils/employeeData'
import { orderBy, sumBy } from 'lodash-es'
import accounting from 'accounting'
import Fuse from 'fuse.js'
// @ts-ignore
import Paginate from "vuejs-paginate-next"
import Popper from "vue3-popper"

const props = defineProps<{
  employeesData: Employee[]
}>()

const state = defineState({
  searchQuery: '',
  sortKey: 'id',
  sortDesc: false,
  currentPage: 1,
  rowsPerPage: 10,

  columns: [
    {
      label: 'ID',
      key: 'id',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Name',
      key: 'name',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Salary',
      key: 'salaryEuros',
      format: (v: number) => accounting.formatMoney(v, { symbol: '€', precision: 0 }),
      displayed: true,
      sortable: true,
      summable: true,
      padding: 5
    },
    {
      label: 'EXP',
      key: 'experienceScore',
      displayed: true,
      sortable: true,
      summable: true,
      padding: 5
    },
    {
      label: 'Address',
      key: 'address',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Phone Number',
      key: 'phone',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Entry Date',
      key: 'entryDate',
      format: (v: string) => new Date(v).toLocaleDateString(),
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Birthday',
      key: 'birthday',
      format: (v: string) => new Date(v).toLocaleDateString(),
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Personal Quote',
      key: 'personalQuote',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    },
    {
      label: 'Favorite Food',
      key: 'favoriteFood',
      displayed: true,
      sortable: true,
      searchable: true,
      padding: 5
    }
  ] satisfies EmployeeColumnDef[],

  get displayedColumns() {
    return this.columns.filter(c => c.displayed)
  },

  get orderedData() {
    return orderBy(props.employeesData, [this.sortKey], [this.sortDesc ? 'desc' : 'asc'])
  },

  get fuse() {
    return new Fuse(this.orderedData, {
      keys: this.columns.filter(c => c.searchable).map(c => c.key as string).concat(['region', 'country']),
      threshold: 0.0,
      ignoreLocation: true
    })
  },

  get filteredOrderedData() {
    if (!this.searchQuery)
      return this.orderedData

    const result = this.fuse.search(this.searchQuery)
    return result.map(r => r.item) as Employee[]
  },

  get numPages() {
    return Math.ceil(this.filteredOrderedData.length / this.rowsPerPage)
  },

  get rows() {
    return this.filteredOrderedData.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage) as Employee[]
  },

  get totals() {
    const totals: Record<string, number> = {}
    for (const col of this.columns) {
      if (col.summable) {
        totals[col.key] = sumBy(this.filteredOrderedData, r => r[col.key] as number)
      }
    }
    return totals
  }
})

// Reset page when user changes search query or ordering
// To avoid confusion
watch(() => [state.searchQuery, state.sortKey, state.sortDesc], () => {
  state.currentPage = 1
})

function toggleSort(key: keyof Employee) {
  if (state.sortKey === key) {
    state.sortDesc = !state.sortDesc
  } else {
    state.sortKey = key
    state.sortDesc = false
  }
}

function formatValue(col: EmployeeColumnDef, value: any) {
  if (col.format) {
    return col.format(value)
  }
  return value
}

function getStatus(col: EmployeeColumnDef, row: Employee) {
  const problems = row.problems[col.key]
  if (problems?.some(p => p.severity === 'error')) {
    return 'error'
  }

  if (problems?.length) {
    return 'warn'
  }

  return 'ok'
}

</script>

<template>
  <div class="EmployeesDataTable">
    <header class="d-flex align-items-center">
      <h1 class="me-2">
        KI-VesD Interview Project
      </h1>
      <Popper>
        <button class="btn settingsBtn">⚙️</button>
        <template #content>
          <div class="settingsGrid">
            <ColumnSettings v-for="col in state.columns" :col="col" />
          </div>
        </template>
      </Popper>
    </header>

    <header class="search-header">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Search" v-model="state.searchQuery">
      </div>
      <div>Showing {{ state.rows.length }} of {{ state.filteredOrderedData.length }} results</div>
    </header>

    <div class="mobile-sort">
      <div class="form-group mb-4">
        <label for="sortKey">Sort By</label>
        <FormSelect id="sortKey" v-model="state.sortKey"
          :options="state.displayedColumns.map(c => ({ text: c.label, value: c.key }))" required />
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="sortDesc" v-model="state.sortDesc">
          <label class="form-check-label" for="sortDesc">
            Descending
          </label>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th v-for="col in state.displayedColumns"
            :class="{ [col.key]: true, sortable: col.sortable, asc: state.sortKey === col.key && !state.sortDesc, desc: state.sortKey === col.key && state.sortDesc }"
            @click="col.sortable ? toggleSort(col.key) : undefined">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in state.rows">
          <td v-for="col in state.displayedColumns" :data-label="col.label" :class="col.key"
            :style="{ padding: col.padding + 'px' }">
            <Popper arrow hover v-for="status in [getStatus(col, row)]">
              <div :class="['cell-content', status]">
                <span v-if="col.key === 'address'">
                  <EmployeeAddress :employee="row" />
                </span>
                <span v-else>{{ formatValue(col, row[col.key]) }}</span>
                <span v-if="status !== 'ok'" :class="status === 'error' ? 'text-danger' : 'text-warning'">⚠️</span>
              </div>

              <template #content>
                <div v-if="col.key === 'address'">
                  <EmployeeAddress :employee="row" />
                </div>
                <div v-else>
                  {{ formatValue(col, row[col.key]) }}
                </div>
                <ul class="mt-2" v-if="status !== 'ok'">
                  <li v-for="problem in row.problems[col.key]"
                    :class="problem.severity === 'error' ? 'text-danger' : 'text-warning'">
                    {{ problem.message }}
                  </li>
                </ul>
              </template>
            </Popper>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-if="state.currentPage < state.numPages" class="dots">
          <td v-for="col in state.columns">
            <span v-if="col.summable">
              ...
            </span>
          </td>
        </tr>
        <tr>
          <td v-for="col in state.columns" :data-label="`${col.label} (TOTAL)`">
            <template v-if="state.totals[col.key]">
              <strong>{{ formatValue(col, state.totals[col.key]) }}</strong>
            </template>
          </td>
        </tr>
      </tfoot>
    </table>

    <nav aria-label="Table pagination">
      <Paginate v-model="state.currentPage" :pageCount="state.numPages" />
    </nav>
  </div>
</template>

<style scoped lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';

.EmployeesDataTable {
  min-height: 90vh;
}

table {
  font-size: 0.9rem;
}

td .cell-content {
  cursor: pointer;
}

:deep(.popper) {
  max-width: 800px;
}

.search-header {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.settingsBtn {
  padding: 0;
  font-size: 1.3rem;
}

.settingsGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-width: 400px;
}

// Desktop layout
@include media-breakpoint-up(lg) {
  .EmployeesDataTable {
    min-width: 80vw;
  }

  .search-header {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .mobile-sort {
    display: none;
  }

  table {
    table-layout: fixed;
  }

  th.id,
  th.experienceScore {
    width: 4rem;
  }

  th.salaryEuros {
    width: 7rem;
  }

  th,
  td {
    padding: 0.3rem;
    width: auto;
  }

  th {
    white-space: nowrap;
  }

  td {
    vertical-align: middle;

    div {
      max-width: 100%;
    }

    .cell-content {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  td.address,
  td.phone {
    font-size: 0.8rem;

  }

  th.sortable {
    background-position: right calc(0.3rem / 2) center;
    padding-right: calc(0.3rem + 0.65em);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='black' opacity='.3' d='M51 1l25 23 24 22H1l25-22zM51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-size: 0.65em 1em;
    cursor: pointer;
    user-select: none;
  }

  th.sortable.asc {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='black' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='black' opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e");
  }

  th.sortable.desc {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='black' opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='black' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e");
  }
}

// Mobile layout
@include media-breakpoint-down(lg) {
  thead {
    display: none;
  }

  tbody,
  tr {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  tr {
    margin-bottom: 10px;
    box-shadow: 0 0 4px #bebebe;
    height: 100%;
    width: 100%;
    align-items: stretch;
  }

  tbody td:first-child {
    font-weight: bold;
  }

  td::before {
    content: attr(data-label);
    float: left;
  }

  tr.dots {
    display: none;
  }

  // Hide labels for the non-summable columns without totals
  tfoot td:empty {
    display: none;
  }

  td {
    display: block;
    text-align: right;
    padding: 10px;
  }
}

:deep(.pagination a) {
  cursor: pointer;
}
</style>