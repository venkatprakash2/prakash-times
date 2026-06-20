import calendarCsv from '../../Birthday_Anniversary Calander - Sheet1.csv?raw'
import { parseCsv } from '../utils/csv'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const calendarRows = parseCsv(calendarCsv)
const calendarHeader = calendarRows[0] ?? []
const monthColumns = calendarHeader.slice(1)

function parseEntry(raw, month, day) {
  const segments = raw
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  return segments.map((segment, index) => {
    const tags = segment.match(/\b(BD|WA|WD|12R|DBJC)\b/gi)?.map((tag) => tag.toUpperCase()) ?? []
    const label = segment.trim()
    const kind = tags.includes('BD') ? 'Birthday' : tags.includes('WA') || tags.includes('WD') ? 'Anniversary' : 'Occasion'

    return {
      id: `${month}-${day}-${index}-${label}`,
      label,
      raw: segment,
      month,
      monthIndex: monthNames.indexOf(month),
      monthShort: monthColumns[monthNames.indexOf(month)] ?? month.slice(0, 3),
      day,
      date: `${month} ${String(day).padStart(2, '0')}`,
      kind,
      tags,
    }
  })
}

function buildCalendar() {
  const months = monthNames.map((month, monthIndex) => ({
    id: month,
    month,
    monthShort: monthAbbreviations[monthIndex],
    monthIndex,
    days: Array.from({ length: 31 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      events: [],
    })),
  }))

  const events = []

  calendarRows.slice(1).forEach((row) => {
    const day = Number(row[0])
    if (!day) return

    monthColumns.forEach((monthShort, monthIndex) => {
      const raw = `${row[monthIndex + 1] ?? ''}`.trim()
      if (!raw) return

      const parsedEntries = parseEntry(raw, monthNames[monthIndex], day)
      months[monthIndex].days[day - 1].events.push(...parsedEntries)
      events.push(...parsedEntries)
    })
  })

  return { months, events }
}

export const { months: birthdayCalendar, events: birthdayEvents } = buildCalendar()

export const birthdays = birthdayEvents.map((event) => ({
  name: event.label,
  date: event.date,
  type: event.kind,
  mood: event.tags.length ? event.tags.join(' / ') : event.raw,
  tags: event.tags,
  month: event.month,
  day: event.day,
  raw: event.raw,
})).slice(0, 12)

export function getEventsForMonth(monthIndex) {
  return birthdayCalendar[monthIndex]?.days.filter((day) => day.events.length > 0) ?? []
}

export function getTodayEvents(date = new Date()) {
  const monthIndex = date.getMonth()
  const day = date.getDate()
  return birthdayCalendar[monthIndex]?.days[day - 1]?.events ?? []
}

export function getUpcomingEvents(date = new Date(), limit = 5) {
  const monthIndex = date.getMonth()
  const day = date.getDate()
  const currentYear = date.getFullYear()
  const todayKey = currentYear * 10000 + (monthIndex + 1) * 100 + day

  return birthdayEvents
    .map((event) => {
      const baseKey = currentYear * 10000 + (event.monthIndex + 1) * 100 + event.day
      const eventKey = baseKey >= todayKey ? baseKey : baseKey + 10000
      return { ...event, eventKey }
    })
    .filter((event) => event.eventKey >= todayKey)
    .sort((left, right) => left.eventKey - right.eventKey)
    .slice(0, limit)
}

export function getMonthName(monthIndex) {
  return monthNames[monthIndex] ?? 'Month'
}
