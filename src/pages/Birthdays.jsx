import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Gift, X } from 'lucide-react'
import Page from '../components/common/Page'
import SectionHeader from '../components/common/SectionHeader'
import Reveal from '../components/animations/Reveal'
import { birthdayCalendar, getMonthName, getTodayEvents, getUpcomingEvents } from '../data/birthdays'
import { readStorage, writeStorage } from '../utils/storage'

const REMINDER_HOUR = 8
const DISMISS_PREFIX = 'prakash-times-birthday-reminder-dismissed-'

function getDayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isMorningReminderWindow(date = new Date()) {
  return date.getHours() >= REMINDER_HOUR
}

function formatReminderTitle(events) {
  if (events.length === 1) return events[0].label
  return `${events.length} occasions today`
}

export default function Birthdays() {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [toastEvents, setToastEvents] = useState([])
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const currentMonth = birthdayCalendar[selectedMonth] ?? birthdayCalendar[today.getMonth()]
  const selectedMonthDays = currentMonth?.days ?? []
  const todayEvents = useMemo(() => getTodayEvents(today), [today.getMonth(), today.getDate()])
  const upcomingEvents = useMemo(() => getUpcomingEvents(today, 6), [today.getMonth(), today.getDate()])
  const selectedDayEvents = selectedMonthDays[selectedDay - 1]?.events ?? []

  useEffect(() => {
    const todayKey = getDayKey()
    const dismissedKey = `${DISMISS_PREFIX}${todayKey}`
    let timeoutId = null

    const maybeShowReminder = () => {
      const current = new Date()
      const todaysEvents = getTodayEvents(current)
      const alreadyDismissed = readStorage(dismissedKey, false)

      if (!todaysEvents.length || alreadyDismissed || !isMorningReminderWindow(current)) {
        return
      }

      writeStorage(dismissedKey, true)
      setToastEvents(todaysEvents)
      setToastMessage(formatReminderTitle(todaysEvents))
      setToastVisible(true)
    }

    maybeShowReminder()
    const intervalId = window.setInterval(maybeShowReminder, 60 * 1000)

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!toastVisible) return undefined

    const dismissTimer = window.setTimeout(() => {
      dismissToast()
    }, 7000)

    return () => window.clearTimeout(dismissTimer)
  }, [toastVisible])

  const dismissToast = () => {
    const key = `${DISMISS_PREFIX}${getDayKey()}`
    writeStorage(key, true)
    setToastVisible(false)
  }

  const monthLabel = getMonthName(selectedMonth)

  return (
    <Page>
      <SectionHeader
        kicker="Family Calendar"
        title="A living calendar for birthdays, anniversaries, and the family dates that deserve a headline."
        copy="This page is now driven by the uploaded calendar CSV and shown in a proper month view, with morning reminders that slide in and disappear on their own."
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <Reveal className="overflow-hidden border border-ink bg-ink text-newsprint shadow-lift">
          <div className="flex items-center justify-between border-b border-newsprint/15 px-6 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Current Month</p>
              <h2 className="mt-2 font-display text-5xl font-black">{monthLabel}</h2>
            </div>
            <CalendarDays size={30} className="text-crema" />
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {birthdayCalendar.map((month) => (
              <button
                key={month.id}
                type="button"
                onClick={() => {
                  setSelectedMonth(month.monthIndex)
                  setSelectedDay(1)
                }}
                className={`border px-4 py-4 text-left transition ${
                  selectedMonth === month.monthIndex ? 'border-newsprint bg-newsprint text-ink' : 'border-newsprint/15 bg-newsprint/10 text-newsprint/78'
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-crema">{month.monthShort}</p>
                <h3 className="mt-2 font-display text-2xl font-black">{month.month}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-80">
                  {month.days.filter((day) => day.events.length > 0).length} active days
                </p>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">Today</p>
          <h3 className="mt-3 font-display text-4xl font-black">{today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          <div className="mt-5 space-y-3">
            {todayEvents.length ? (
              todayEvents.map((event) => (
                <div key={event.id} className="border border-ink/15 bg-paper p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-coffee">{event.kind}</p>
                  <h4 className="mt-2 font-display text-3xl font-black">{event.label}</h4>
                  <p className="mt-2 text-sm leading-6 text-ink/68">{event.raw}</p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-ink/68">No matching occasions today. Check the month calendar to browse upcoming family dates.</p>
            )}
          </div>
        </Reveal>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <Reveal className="border border-ink/15 bg-newsprint/78 p-5 shadow-paper">
          <div className="mb-4 flex items-center justify-between">
            <button type="button" onClick={() => setSelectedMonth((value) => (value === 0 ? 11 : value - 1))} className="grid size-10 place-items-center border border-ink/20">
              <ChevronLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Month View</p>
              <h3 className="mt-2 font-display text-4xl font-black">{monthLabel}</h3>
            </div>
            <button type="button" onClick={() => setSelectedMonth((value) => (value === 11 ? 0 : value + 1))} className="grid size-10 place-items-center border border-ink/20">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {renderMonthCells(currentMonth, selectedMonth, selectedDay, today).map((cell) => (
              <button
                key={cell.key}
                type="button"
                onClick={() => cell.day && setSelectedDay(cell.day)}
              className={`min-h-28 border p-2 text-left transition ${cell.isToday ? 'border-burgundy bg-burgundy/8' : 'border-ink/10 bg-paper hover:bg-ink/5'} ${cell.isSelected ? 'ring-2 ring-ink ring-inset' : ''} ${!cell.day ? 'pointer-events-none opacity-30' : ''}`}
              >
                {cell.day ? (
                  <>
                    <div className="flex items-start justify-between">
                      <span className={`text-sm font-bold ${cell.isToday ? 'text-burgundy' : 'text-ink'}`}>{cell.day}</span>
                      {cell.events.length > 0 && <span className="size-2 rounded-full bg-burgundy" />}
                    </div>
                    <div className="mt-2 space-y-1">
                      {cell.events.slice(0, 2).map((event) => (
                        <p key={event.id} className="line-clamp-2 text-[11px] font-medium leading-4 text-ink/72">
                          {event.label}
                        </p>
                      ))}
                      {cell.events.length > 2 && <p className="text-[10px] uppercase tracking-[0.18em] text-coffee">+{cell.events.length - 2} more</p>}
                    </div>
                  </>
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6">
          <Reveal className="border border-ink/15 bg-ink p-6 text-newsprint shadow-lift">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-crema">Selected Day</p>
            <h3 className="mt-3 font-display text-4xl font-black">{monthLabel} {String(selectedDay).padStart(2, '0')}</h3>
            <div className="mt-5 space-y-3">
              {selectedDayEvents.length ? (
                selectedDayEvents.map((event) => (
                  <div key={event.id} className="border border-newsprint/15 bg-newsprint/8 p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-crema">{event.kind}</span>
                      {event.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.2em] text-newsprint/55">{tag}</span>
                      ))}
                    </div>
                    <h4 className="mt-2 font-display text-3xl font-black">{event.label}</h4>
                    <p className="mt-2 text-sm leading-6 text-newsprint/72">{event.raw}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-newsprint/70">No events on this day in the CSV.</p>
              )}
            </div>
          </Reveal>

          <Reveal className="border border-ink/15 bg-newsprint/78 p-6 shadow-paper">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-coffee">Coming Up</p>
            <div className="mt-4 space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-t border-ink/15 pt-3 first:border-0 first:pt-0">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-burgundy">{event.date}</p>
                  <h4 className="mt-1 font-display text-2xl font-black">{event.label}</h4>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {toastVisible && toastEvents.length ? (
          <motion.div
            initial={{ opacity: 0, x: 80, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 80, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[120] w-[min(92vw,24rem)] overflow-hidden border border-ink bg-ink text-newsprint shadow-lift"
          >
            <div className="absolute inset-0 opacity-15">
              <div className="coffee-ring absolute -right-10 -top-10 size-28" />
            </div>
            <div className="relative p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crema">Morning Reminder</p>
                  <h4 className="mt-2 font-display text-3xl font-black leading-none">{toastMessage}</h4>
                </div>
                <button type="button" onClick={dismissToast} className="grid size-10 place-items-center border border-newsprint/20" aria-label="Dismiss reminder">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {toastEvents.map((event) => (
                  <div key={event.id} className="border border-newsprint/10 bg-newsprint/8 px-3 py-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-crema">{event.kind}</p>
                    <p className="mt-1 text-sm leading-5 text-newsprint/78">{event.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-newsprint/50">Auto dismisses after 7 seconds.</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Page>
  )
}

function renderMonthCells(month, selectedMonth, selectedDay, today) {
  if (!month) return []

  const year = today.getFullYear()
  const firstDayOfWeek = new Date(year, selectedMonth, 1).getDay()
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate()
  const cells = []

  for (let index = 0; index < firstDayOfWeek; index += 1) {
    cells.push({ key: `blank-${index}`, day: null, events: [], isToday: false })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const events = month.days[day - 1]?.events ?? []
    const isToday = today.getMonth() === selectedMonth && today.getDate() === day
    cells.push({
      key: `day-${day}`,
      day,
      events,
      isToday,
      isSelected: selectedDay === day,
    })
  }

  while (cells.length % 7 !== 0) {
    cells.push({ key: `trail-${cells.length}`, day: null, events: [], isToday: false })
  }

  return cells
}
