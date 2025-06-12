const COLOR_BG    = new Color("242424", 1)
const COLOR_WHITE = new Color("FFFFFF", 1)

const SIZE_CURRENT  = new Size( 40, 150)
const SIZE_LINE     = new Size(  2, 150)
const SIZE_EVENT    = new Size(120, 150)
const SIZE_PAD      = new Size( 10, 150)
const SIZE_REMINDER = new Size(160, 150)

const SIZE_CURRENT_DAY    = new Size(40, 20)
const SIZE_CURRENT_DATE   = new Size(40, 40)
const SIZE_CURRENT_PAD    = new Size(40,  5)
const SIZE_CURRENT_FUTURE = new Size(40, 35)
const SIZE_CURRENT_FDATE  = new Size(30, 35)
const SIZE_CURRENT_FALERT = new Size(10, 35)
const SIZE_CURRENT_FCOUNT = new Size(10, 15)

const SIZE_EVENT_PAD           = new Size(120,  5)
const SIZE_EVENT_ALL_DAY_TITLE = new Size(120, 15)
const SIZE_EVENT_TITLE         = new Size(120, 23)
const SIZE_EVENT_TIME          = new Size(120, 15)
const SIZE_EVENT_REMAINDER     = new Size(120, 14)

const SIZE_REMINDER_PAD       = new Size(160, 10)
const SIZE_REMINDER_TITLE     = new Size(160, 20)
const SIZE_REMINDER_REMAINDER = new Size(160, 20)

const FONT_DAY           = Font.regularMonospacedSystemFont(13)
const FONT_DATE          = Font.mediumSystemFont(30)
const FONT_ALL_DAY_EVENT = Font.semiboldMonospacedSystemFont(13)
const FONT_EVENT         = Font.semiboldMonospacedSystemFont(18)
const FONT_TIME          = Font.regularMonospacedSystemFont(13)
const FONT_REMINDER      = Font.semiboldSystemFont(15)
const FONT_REMAINDER     = Font.regularMonospacedSystemFont(13)

const DF_DAY  = new DateFormatter(); DF_DAY.dateFormat  = "E"
const DF_DATE = new DateFormatter(); DF_DATE.dateFormat = "d"
const DF_TIME = new DateFormatter(); DF_TIME.dateFormat = "HH:mm"

function buildStack(parent_stack, backgroundColor, size)
{
  stack = parent_stack.addStack()
  stack.size = size;
  stack.backgroundColor = backgroundColor

  return stack
}

function addEvent(events, event)
{
  events.push
  ({
    id: event.identifier,
    name: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
  })
}

function buildReminderStack(stack_reminder, name)
{
  const text_reminder = stack_reminder.addText(name)

  stack_reminder.addSpacer()
  text_reminder.font = FONT_REMINDER
  text_reminder.textColor = COLOR_WHITE
}

function buildAllDayEventStack(event, stack_title)
{
  const text_title = stack_title.addText(event.name)

  stack_title.backgroundColor = COLOR_WHITE
  text_title.font = FONT_ALL_DAY_EVENT
  text_title.textColor = COLOR_BG
}

function buildEventStack(event, stack_title, stack_time)
{
  const text_title = stack_title.addText(event.name)
  const text_time_start = DF_TIME.string(event.startDate)
  const text_time_end = DF_TIME.string(event.endDate)
  const text_time = stack_time.addText(text_time_start + " ~ " + text_time_end)

  text_time.font = FONT_TIME
  stack_title.backgroundColor = COLOR_WHITE
  stack_time.backgroundColor = COLOR_WHITE
  text_title.font = FONT_EVENT
  text_title.textColor = COLOR_BG
  text_time.textColor = COLOR_BG
}

function buildRemainderStack(stack_remainder, count, postfix)
{
  const text_summary = stack_remainder.addText("... +" + count + " more " + postfix)

  stack_remainder.backgroundColor = COLOR_WHITE
  text_summary.font = FONT_REMAINDER
  text_summary.textColor = COLOR_BG
}

function buildFutureAlert(stack_future, date)
{
  const stack_date   = buildStack(stack_future, COLOR_BG, SIZE_CURRENT_FDATE)
  const stack_alerts = buildStack(stack_future, COLOR_BG, SIZE_CURRENT_FALERT)
  stack_alerts.layoutVertically()
  const stack_es     = buildStack(stack_alerts, COLOR_BG, SIZE_CURRENT_FCOUNT)
  const stack_rms    = buildStack(stack_alerts, COLOR_BG, SIZE_CURRENT_FCOUNT)

  const events = await CalendarEvent.tomorrow([])
  const reminders = await Reminder.all([])

  // find events
  let count_es = 0
  for (const e of events)
    if (e.startDate.getTime() > date.getTime())
      count_es += 1

  // find reminders
  let count_rms = 0
  for (const reminder of reminders)
    if (!reminder.isCompleted && reminder.dueDate != null && reminder.dueDate.getDate() == date.getDate())
      count_rms += 1

  // set date
  const text_date = stack_date.addText(DF_DATE.string(date))
  stack_date.centerAlignContent()
  text_date.centerAlignText()

  const text_es = stack_es.addText(count_es)
  const text_rms = stack_es.addText(count_rms)
}

async function buildReminders(today, reminders, stack_reminders)
{
  const stack_p0  = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_PAD)
  const stack_rm0 = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_TITLE)
  const stack_p1  = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_PAD)
  const stack_rm1 = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_TITLE)
  const stack_p2  = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_PAD)
  const stack_rm2 = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_TITLE)
  const stack_p3  = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_PAD)
  const stack_rm3 = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_TITLE)
  const stack_p4  = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_PAD)
  const stack_r   = buildStack(stack_reminders, COLOR_BG, SIZE_REMINDER_REMAINDER)

  // find today's reminders
  let reminders_today = []
  for (const reminder of reminders)
  {
    if (!reminder.isCompleted && reminder.dueDate != null && reminder.dueDate.getDate() == today.getDate())
    {
      reminders_today.push
      ({
          id: reminder.identifier,
          name: reminder.title,
          dd: reminder.dueDate
      })
    }
  }
  // sort reminders in ascending order
  reminders_today.sort((a, b) => a.dd - b.dd)

  // check for first reminder
  if (reminders_today.length > 0)
    buildReminderStack(stack_rm0, reminders_today[0].name)
  // check for second reminder
  if (reminders_today.length > 1)
    buildReminderStack(stack_rm1, reminders_today[1].name)
  // check for third reminder
  if (reminders_today.length > 2)
    buildReminderStack(stack_rm2, reminders_today[2].name)
  // check for fourth reminder
  if (reminders_today.length > 3)
    buildReminderStack(stack_rm3, reminders_today[3].name)
  // check if there are five reminders today
  if (reminders_today.length == 5)
    buildRemainderStack(stack_r, 1, "reminder")
  // check if there are six or more reminders today
  else if (reminders_today.length > 5)
    buildRemainderStack(stack_r, reminders_today.length - 4, "reminders")
}

async function buildEvents(today, events, stack_events)
{
  const stack_p0   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)
  const stack_adt0 = buildStack(stack_events, COLOR_BG, SIZE_EVENT_ALL_DAY_TITLE)
  const stack_p1   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)
  const stack_adt1 = buildStack(stack_events, COLOR_BG, SIZE_EVENT_ALL_DAY_TITLE)
  const stack_p2   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)
  const stack_t0   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_TITLE)
  const stack_d0   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_TIME)
  const stack_p3   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)
  const stack_t1   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_TITLE)
  const stack_d1   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_TIME)
  const stack_p4   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)
  const stack_r    = buildStack(stack_events, COLOR_BG, SIZE_EVENT_REMAINDER)
  const stack_p5   = buildStack(stack_events, COLOR_BG, SIZE_EVENT_PAD)

  // find today's events
  let all_day_events_today = []
  let events_today = []
  for (const e of events)
  {
    const text_event_start = DF_TIME.string(e.startDate)
    const text_event_end = DF_TIME.string(e.endDate)
    const compare_start = text_event_start.localeCompare("00:00")
    const compare_end = text_event_end.localeCompare("23:59")

    if (compare_start == 0 && compare_end == 0)
      addEvent(all_day_events_today, e)
    else if (e.startDate.getTime() > today.getTime())
      addEvent(events_today, e)
  }

  // check for first all day event
  if (all_day_events_today.length > 0)
    buildAllDayEventStack(all_day_events_today[0], stack_adt0)
  // check for second all day event
  if (all_day_events_today.length > 1)
    buildAllDayEventStack(all_day_events_today[1], stack_adt1)
  // check for today's first event
  if (events_today.length > 0)
    buildEventStack(events_today[0], stack_t0, stack_d0)
  // check for today's second event
  if (events_today.length > 1)
    buildEventStack(events_today[1], stack_t1, stack_d1)
  // check if there are three events today
  if (events_today.length == 3)
    buildRemainderStack(stack_r, 1, "event")
  // check if there are four or more events today
  else if (events_today.length > 3)
    buildRemainderStack(stack_r, events_today.length - 2, "events")
}

async function buildLine(stack_line)
{
  stack_line.size = SIZE_LINE
  stack_line.backgroundColor = COLOR_WHITE
}

async function buildCurrent(today, stack_current)
{
  const stack_day  = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_DAY)
  const stack_date = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_DATE)
  const stack_p0   = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_PAD)
  const stack_f0   = buildStack(stack_current, COLOR_WHITE, SIZE_CURRENT_FUTURE)
  const stack_p1   = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_PAD)
  const stack_f1   = buildStack(stack_current, COLOR_WHITE, SIZE_CURRENT_FUTURE)
  const stack_p2   = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_PAD)
  const stack_p3   = buildStack(stack_current, COLOR_BG,    SIZE_CURRENT_PAD)

  const text_day = stack_day.addText(DF_DAY.string(today))
  const text_date = stack_date.addText(DF_DATE.string(today))

  const plus_one = new Date(today)
  const plus_two = new Date(today)

  // set up today's day and date
  stack_day.centerAlignContent()
  stack_date.centerAlignContent()
  text_day.centerAlignText()
  text_date.centerAlignText()
  text_day.font = FONT_DAY
  text_date.font = FONT_DATE

  // show number of tomorrow's events and reminders
  plus_one.setDate(today.getDate() + 1)
  buildFuture(stack_f1, plus_one)
  // show number of day after tomorrow's events and reminders
  plus_two.setDate(today.getDate() + 2)
  buildFuture(stack_f2, plus_two)
}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack_layout = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()
  const stack_current = stack_layout.addStack()
  const stack_line = stack_layout.addStack()
  const stack_events = stack_layout.addStack()
  const stack_pad = stack_layout.addStack()
  const stack_reminders = stack_layout.addStack()

  stack_current.layoutVertically()
  stack_events.layoutVertically()
  stack_reminders.layoutVertically()

  buildCurrent(today, stack_current)
  buildLine(stack_line)
  buildEvents(today, events, stack_events)
  stack_pad.size = SIZE_PAD
  buildReminders(today, reminders, stack_reminders)

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
