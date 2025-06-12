const COLOR_BG = new Color("242424", 1)
const COLOR_WHITE = new Color("FFFFFF", 1)

const SIZE_CURRENT = new Size(40, 150)
const SIZE_CURRENT_DAY = new Size(40, 20)
const SIZE_CURRENT_DATE = new Size(40, 40)
const SIZE_CURRENT_EMPTY = new Size(40, 90)

const SIZE_LINE = new Size(2, 150)

const SIZE_EVENT = new Size(120, 150)
const SIZE_EVENT_PAD = new Size(120, 5)
const SIZE_EVENT_ALL_DAY_TITLE = new Size(120, 15)
const SIZE_EVENT_TITLE = new Size(120, 23)
const SIZE_EVENT_TIME = new Size(120, 15)
const SIZE_EVENT_REMAINDER = new Size(120, 14)

const SIZE_PAD = new Size(10, 150)

const SIZE_REMINDER = new Size(160, 150)
const SIZE_REMINDER_PAD = new Size(160, 10)
const SIZE_REMINDER_TITLE = new Size(160, 20)
const SIZE_REMINDER_REMAINDER = new Size(160, 20)

const FONT_DAY = Font.regularMonospacedSystemFont(13)
const FONT_DATE = Font.mediumSystemFont(30)
const FONT_ALL_DAY_EVENT = Font.semiboldMonospacedSystemFont(13)
const FONT_EVENT = Font.semiboldMonospacedSystemFont(18)
const FONT_TIME = Font.regularMonospacedSystemFont(13)
const FONT_REMINDER = Font.semiboldSystemFont(15)
const FONT_REMAINDER = Font.regularMonospacedSystemFont(13)

const DF_DAY = new DateFormatter()
DF_DAY.dateFormat = "E"
const DF_DATE = new DateFormatter()
DF_DATE.dateFormat = "d"
const DF_TIME = new DateFormatter()
DF_TIME.dateFormat = "HH:mm"

async function buildReminders(today, reminders, stack_reminders)
{
  const stack_pad0 = stack_reminders.addStack()
  const stack_rm0 = stack_reminders.addStack()
  const stack_pad1 = stack_reminders.addStack()
  const stack_rm1 = stack_reminders.addStack()
  const stack_pad2 = stack_reminders.addStack()
  const stack_rm2 = stack_reminders.addStack()
  const stack_pad3 = stack_reminders.addStack()
  const stack_rm3 = stack_reminders.addStack()
  const stack_pad4 = stack_reminders.addStack()
  const stack_remainder = stack_reminders.addStack()
  stack_reminders.size = SIZE_REMINDER
  stack_pad0.size = SIZE_REMINDER_PAD
  stack_rm0.size = SIZE_REMINDER_TITLE
  stack_pad1.size = SIZE_REMINDER_PAD
  stack_rm1.size = SIZE_REMINDER_TITLE
  stack_pad2.size = SIZE_REMINDER_PAD
  stack_rm2.size = SIZE_REMINDER_TITLE
  stack_pad3.size = SIZE_REMINDER_PAD
  stack_rm3.size = SIZE_REMINDER_TITLE
  stack_pad4.size = SIZE_REMINDER_PAD
  stack_remainder.size = SIZE_REMINDER_REMAINDER
  stack_reminders.backgroundColor = COLOR_BG
  stack_pad0.backgroundColor = COLOR_BG
  stack_rm0.backgroundColor = COLOR_BG
  stack_pad1.backgroundColor = COLOR_BG
  stack_rm1.backgroundColor = COLOR_BG
  stack_pad2.backgroundColor = COLOR_BG
  stack_rm2.backgroundColor = COLOR_BG
  stack_pad3.backgroundColor = COLOR_BG
  stack_rm3.backgroundColor = COLOR_BG
  stack_pad4.backgroundColor = COLOR_BG
  stack_remainder.backgroundColor = COLOR_BG

  let reminders_today = []
  for (const reminder of reminders)
  {
    if (!reminder.isCompleted &&
        reminder.dueDate != null &&
        reminder.dueDate.getDate() == today.getDate())
    {
      reminders_today.push
      ({
          id: reminder.identifier,
          name: reminder.title,
          ct: reminder.dueDate
      })
    }
  }
  reminders_today.sort((a, b) => a.ct - b.ct)

  if (reminders_today.length > 0)
  {
    const text_rm0 = stack_rm0.addText(reminders_today[0].name)
    stack_rm0.addSpacer()
    text_rm0.font = FONT_REMINDER
    text_rm0.textColor = COLOR_WHITE
  }
  if (reminders_today.length > 1)
  {
    const text_rm1 = stack_rm1.addText(reminders_today[1].name)
    stack_rm1.addSpacer()
    text_rm1.font = FONT_REMINDER
    text_rm1.textColor = COLOR_WHITE
  }
  if (reminders_today.length > 2)
  {
    const text_rm2 = stack_rm2.addText(reminders_today[2].name)
    stack_rm2.addSpacer()
    text_rm2.font = FONT_REMINDER
    text_rm2.textColor = COLOR_WHITE
  }
  if (reminders_today.length > 3)
  {
    const text_rm3 = stack_rm3.addText(reminders_today[3].name)
    stack_rm3.addSpacer()
    text_rm3.font = FONT_REMINDER
    text_rm3.textColor = COLOR_WHITE
  }
  if (reminders_today.length == 5)
  {
    const text_summary = stack_remainder.addText("... +1 more reminder")
    stack_remainder.addSpacer()
    text_summary.font = FONT_REMAINDER
    text_summary.textColor = COLOR_WHITE
  }
  else if (reminders_today.length > 5)
  {
    const count = reminders_today.length - 4
    const text_summary = stack_remainder.addText("... +" + count + " more reminders")
    stack_remainder.addSpacer()
    text_summary.font = FONT_REMAINDER
    text_summary.textColor = COLOR_WHITE
  }
}

async function buildAllDayEventStack(event, stack_title)
{
  const text_title = stack_title.addText(event.name)

  stack_title.backgroundColor = COLOR_WHITE

  text_title.font = FONT_ALL_DAY_EVENT
  text_title.textColor = COLOR_BG
}

async function buildEventStack(event, stack_title, stack_time)
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

async function buildRemainderStack(stack_remainder, count)
{
  const text_summary = stack_remainder.addText("... +" + count + " more events")

  stack_remainder.backgroundColor = COLOR_WHITE

  text_summary.font = FONT_REMAINDER
  text_summary.textColor = COLOR_BG
}

async function buildEvents(today, events, stack_events)
{
  let events_today = []
  let all_day_events_today = []
  for (const event of events)
  {
    const text_event_start = DF_TIME.string(event.startDate)
    const text_event_end = DF_TIME.string(event.endDate)
    const compare_start = text_event_start.localeCompare("00:00")
    const compare_end = text_event_end.localeCompare("23:59")

    if (compare_start == 0 && compare_end == 0)
    {
      all_day_events_today.push
      ({
        id: event.identifier,
        name: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
      })
    }
    else if (event.startDate.getTime() > today.getTime())
    {
      events_today.push
      ({
        id: event.identifier,
        name: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
      })
    }
  }

  const stack_pad0 = stack_events.addStack()
  const stack_all_day_title0 = stack_events.addStack()
  const stack_pad1 = stack_events.addStack()
  const stack_all_day_title1 = stack_events.addStack()
  const stack_pad2 = stack_events.addStack()
  const stack_title0 = stack_events.addStack()
  const stack_time0 = stack_events.addStack()
  const stack_pad3 = stack_events.addStack()
  const stack_title1 = stack_events.addStack()
  const stack_time1 = stack_events.addStack()
  const stack_pad4 = stack_events.addStack()
  const stack_remainder = stack_events.addStack()
  const stack_pad5 = stack_events.addStack()

  stack_events.size = SIZE_EVENT
  stack_pad0.size = SIZE_EVENT_PAD
  stack_pad1.size = SIZE_EVENT_PAD
  stack_pad2.size = SIZE_EVENT_PAD
  stack_pad3.size = SIZE_EVENT_PAD
  stack_pad4.size = SIZE_EVENT_PAD
  stack_pad5.size = SIZE_EVENT_PAD
  stack_all_day_title0.size = SIZE_EVENT_ALL_DAY_TITLE
  stack_all_day_title1.size = SIZE_EVENT_ALL_DAY_TITLE
  stack_title0.size = SIZE_EVENT_TITLE
  stack_title1.size = SIZE_EVENT_TITLE
  stack_time0.size = SIZE_EVENT_TIME
  stack_time1.size = SIZE_EVENT_TIME
  stack_remainder.size = SIZE_EVENT_REMAINDER
  stack_events.backgroundColor = COLOR_BG
  stack_pad0.backgroundColor = COLOR_BG
  stack_pad1.backgroundColor = COLOR_BG
  stack_pad2.backgroundColor = COLOR_BG
  stack_pad3.backgroundColor = COLOR_BG
  stack_pad4.backgroundColor = COLOR_BG
  stack_pad5.backgroundColor = COLOR_BG
  stack_all_day_title0.backgroundColor = COLOR_BG
  stack_all_day_title1.backgroundColor = COLOR_BG
  stack_title0.backgroundColor = COLOR_BG
  stack_title1.backgroundColor = COLOR_BG
  stack_time0.backgroundColor = COLOR_BG
  stack_time1.backgroundColor = COLOR_BG
  stack_remainder.backgroundColor = COLOR_BG

  if (all_day_events_today.length > 0)
    buildAllDayEventStack(all_day_events_today[0], stack_all_day_title0)
  if (all_day_events_today.length > 1)
    buildAllDayEventStack(all_day_events_today[1], stack_all_day_title1)
  if (events_today.length > 0)
    buildEventStack(events_today[0], stack_title0, stack_time0)
  if (events_today.length > 1)
    buildEventStack(events_today[1], stack_title1, stack_time1)
  if (events_today.length == 3)
    buildRemainderStack(stack_remainder, 1)
  if (events_today.length > 3)
    buildRemainderStack(stack_remainder, events_today.length - 2)
}

async function buildLine(stack_line)
{
  stack_line.size = SIZE_LINE
  stack_line.backgroundColor = COLOR_WHITE
}

async function buildCurrent(today, stack_current)
{
  const stack_day = stack_current.addStack()
  const stack_date = stack_current.addStack()
  const stack_empty = stack_current.addStack()
  const text_day = stack_day.addText(DF_DAY.string(today))
  const text_date = stack_date.addText(DF_DATE.string(today))

  stack_day.centerAlignContent()
  stack_date.centerAlignContent()
  text_day.centerAlignText()
  text_date.centerAlignText()

  stack_current.size = SIZE_CURRENT
  stack_day.size = SIZE_CURRENT_DAY
  stack_date.size = SIZE_CURRENT_DATE
  stack_empty.size = SIZE_CURRENT_EMPTY

  text_day.font = FONT_DAY
  text_date.font = FONT_DATE
}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack_layout = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()

  stack_layout.layoutHorizontally()

  const stack_current = stack_layout.addStack()
  const stack_line = stack_layout.addStack()
  const stack_events = stack_layout.addStack()
  const stack_pad = stack_layout.addStack()
  const stack_reminders = stack_layout.addStack()

  stack_current.layoutVertically()
  stack_events.layoutVertically()
  stack_reminders.layoutVertically()
  stack_pad.size = SIZE_PAD

  buildCurrent(today, stack_current)
  buildLine(stack_line)
  buildEvents(today, events, stack_events)
  buildReminders(today, reminders, stack_reminders)

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
