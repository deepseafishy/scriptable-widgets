// colors
const COLOR_BG         = new Color("242424", 1)
const COLOR_WHITE      = new Color("FFFFFF", 1)
const COLOR_GRAY       = new Color("808080", 1)

// major stack sizes
// const SIZE_TOTAL    = new Size(320, 160)
const SIZE_STACK_D     = new Size(320,  38)
const SIZE_STACK_H     = new Size(320,  10)
const SIZE_STACK_L     = new Size(320,   2)
const SIZE_STACK_C     = new Size(320, 110)
const SIZE_STACK_E     = new Size(145, 110)
const SIZE_STACK_R     = new Size(145, 110)
const SIZE_STACK_P     = new Size( 10, 110)
const SIZE_STACK_PAD   = new Size(145,   5)

// date stack sizes
const SIZE_STACK_DB    = new Size( 40,  38)
const SIZE_STACK_DAY   = new Size( 40,  10)
const SIZE_STACK_DATE  = new Size( 40,  18)
const SIZE_STACK_ALERT = new Size( 40,  10)
const SIZE_STACK_BDAY  = new Size( 40,  15)
const SIZE_STACK_BDATE = new Size( 40,  25)

// habit stack sizes
const SIZE_STACK_HB    = new Size( 10,  10)
const SIZE_DOT         = 50
const SIZE_ACTUAL_DOT  = new Size(  4,   4)

// event stack sizes
const SIZE_STACK_ADE   = new Size(145,  14)
const SIZE_EVENT_TITLE         = new Size(145, 14)
const SIZE_EVENT_TIME          = new Size(145, 10)
const SIZE_EVENT_REMAINDER     = new Size(145, 11)

// fonts
const FONT_DAY         = Font.regularMonospacedSystemFont(8)
const FONT_DATE        = Font.mediumSystemFont(18)
const FONT_ALERT       = Font.mediumSystemFont(8)
const FONT_BDAY        = Font.semiboldMonospacedSystemFont(11)
const FONT_BDATE       = Font.semiboldSystemFont(28)
const FONT_ADE         = Font.semiboldMonospacedSystemFont(13)

const FONT_EVENT       = Font.semiboldMonospacedSystemFont(18)
const FONT_TIME        = Font.regularMonospacedSystemFont(13)

// date formats
const DF_DAY  = new DateFormatter()
DF_DAY.dateFormat = "E"
const DF_DATE = new DateFormatter()
DF_DATE.dateFormat = "d"
const DF_TIME = new DateFormatter()
DF_TIME.dateFormat = "HH:mm"

function drawDot(stack, dot_resolution, size, color)
{
  const ctx = new DrawContext()

  ctx.size = new Size(dot_resolution, dot_resolution)
  ctx.opaque = false
  ctx.setFillColor(color)
  ctx.fillEllipse(new Rect(0, 0, dot_resolution, dot_resolution))

  const dot = stack.addImage(ctx.getImage())

  stack.centerAlignContent()
  dot.imageSize = size
}

function addEventStack(e, stack_title, stack_time)
{
  const text_title = stack_title.addText(e.name)
  const text_time_start = DF_TIME.string(e.startDate)
  const text_time_end = DF_TIME.string(e.endDate)
  const text_time = stack_time.addText(text_time_start + " ~ " + text_time_end)

  text_time.font = FONT_TIME
  stack_title.backgroundColor = COLOR_WHITE
  stack_time.backgroundColor = COLOR_WHITE
  text_title.font = FONT_EVENT
  text_title.textColor = COLOR_BG
  text_time.textColor = COLOR_BG
}

function addAllDayEvent(stack, events, idx)
{
  const stack_pad   = addStack(stack, SIZE_STACK_PAD, COLOR_BG)
  const stack_event = addStack(stack, SIZE_STACK_ADE, COLOR_BG)

  if (events.length > idx)
  {
    const text_title = stack_event.addText(events[idx].name)

    stack_event.backgroundColor = COLOR_WHITE
    text_title.font = FONT_ADE
    text_title.textColor = COLOR_BG
  }
}

function addEvent(events, evnt)
{
  events.push
  ({
    id: evnt.identifier,
    name: evnt.title,
    startDate: evnt.startDate,
    endDate: evnt.endDate,
  })
}

function addWhiteText(stack, content, font)
{
  const text = stack.addText(content)

  stack.centerAlignContent()
  text.centerAlignText()
  text.font = font
  text.textColor = COLOR_WHITE
}

function addLine(stack, size, color)
{
  const stack_child = stack.addStack()

  stack_child.size = size
  stack_child.backgroundColor = color
}

function addStack(stack, size, color)
{
  const stack_child = stack.addStack()

  stack_child.size = size
  stack_child.backgroundColor = color

  return stack_child
}

function drawReminders(stack)
{
}

function drawEvents(stack, events)
{
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

  stack.layoutVertically()
  addAllDayEvent(stack, all_day_events_today, 0)
  addAllDayEvent(stack, all_day_events_today, 1)

  const stack_p2   = addStack(stack,           SIZE_EVENT_PAD,    COLOR_BG)
  const stack_t0   = addStack(stack,         SIZE_EVENT_TITLE, COLOR_WHITE)
  const stack_d0   = addStack(stack,          SIZE_EVENT_TIME, COLOR_WHITE)
  const stack_p3   = addStack(stack,           SIZE_EVENT_PAD,    COLOR_BG)
  const stack_t1   = addStack(stack,         SIZE_EVENT_TITLE, COLOR_WHITE)
  const stack_d1   = addStack(stack,          SIZE_EVENT_TIME, COLOR_WHITE)
  const stack_p4   = addStack(stack,           SIZE_EVENT_PAD,    COLOR_BG)
  const stack_r    = addStack(stack,     SIZE_EVENT_REMAINDER, COLOR_WHITE)

  // check for today's first event
  if (events_today.length > 0)
    addEventStack(events_today[0], stack_t0, stack_d0)
  // check for today's second event
  if (events_today.length > 1)
    addEventStack(events_today[1], stack_t1, stack_d1)
  // check if there are three events today
  if (events_today.length == 3)
    addRemainderStack(stack_r, 1, "event")
  // check if there are four or more events today
  else if (events_today.length > 3)
    addRemainderStack(stack_r, events_today.length - 2, "events")
}

function drawHabits(stack)
{
  for (let i = 0; i < 31; ++i)
  {
    const stack_block = addStack(stack, SIZE_STACK_HB, COLOR_BG)

    drawDot(stack_block, /*dot_resolution*/ 50, SIZE_ACTUAL_DOT, COLOR_WHITE)
  }
}

function drawDates(stack)
{
  for (let i = 0; i < 7; ++i)
  {
    const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
    const stack_block = addStack(stack, SIZE_STACK_DB, COLOR_BG)

    // create day, date, and alert stack
    stack_block.layoutVertically()
    if (i == 0)
    {
      const stack_day   = addStack(stack_block,  SIZE_STACK_BDAY, COLOR_BG)
      const stack_date  = addStack(stack_block, SIZE_STACK_BDATE, COLOR_BG)

      addWhiteText(  stack_day,  DF_DAY.string(date),  FONT_BDAY)
      addWhiteText( stack_date, DF_DATE.string(date), FONT_BDATE)
    }
    else
    {
      const stack_day   = addStack(stack_block,   SIZE_STACK_DAY, COLOR_BG)
      const stack_date  = addStack(stack_block,  SIZE_STACK_DATE, COLOR_BG)
      const stack_alert = addStack(stack_block, SIZE_STACK_ALERT, COLOR_BG)

      addWhiteText(  stack_day,  DF_DAY.string(date),   FONT_DAY)
      addWhiteText( stack_date, DF_DATE.string(date),  FONT_DATE)
      addWhiteText(stack_alert,                "+11", FONT_ALERT)
    }
  }
}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()

  stack.layoutVertically()
  // create date, habit, line, and content stack
  const stack_d = addStack(  stack, SIZE_STACK_D, COLOR_BG)
  const stack_h = addStack(  stack, SIZE_STACK_H, COLOR_BG)
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_c = addStack(  stack, SIZE_STACK_C, COLOR_BG)

  // create event and reminder stack
  addStack(stack_c, SIZE_STACK_P, COLOR_BG)
  const stack_e = addStack(stack_c, SIZE_STACK_E, COLOR_ORANGE)
  addStack(stack_c, SIZE_STACK_P, COLOR_BG)
  const stack_r = addStack(stack_c, SIZE_STACK_R, COLOR_GRAY)
  addStack(stack_c, SIZE_STACK_P, COLOR_BG)

  drawDates(stack_d)
  drawHabits(stack_h)
  drawEvents(stack_e, events)
  drawReminders(stack_r)

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
