// colors
const COLOR_BG          = new Color("242424", 1)
const COLOR_WHITE       = new Color("FFFFFF", 1)
const COLOR_GRAY        = new Color("808080", 1)
const COLOR_BLUE        = new Color("0000FF", 1)

// major stack sizes
// const SIZE_TOTAL     = new Size(320, 160)
const SIZE_STACK_D      = new Size(320,  38)
const SIZE_STACK_L      = new Size(320,  10)
const SIZE_STACK_SL     = new Size(320,   2)
const SIZE_STACK_C      = new Size(320, 200)
const SIZE_STACK_E      = new Size(145, 200)
const SIZE_STACK_R      = new Size(145, 200)
const SIZE_STACK_P      = new Size( 10, 200)
const SIZE_STACK_PAD    = new Size(145,   5)
const SIZE_STACK_RS     = new Size(145,  11)
const SIZE_STACK_H      = new Size(320,  50)
const SIZE_STACK_HC     = new Size(320,  10)

// date stack sizes
const SIZE_STACK_DB     = new Size( 40,  38)
const SIZE_STACK_DAY    = new Size( 40,  10)
const SIZE_STACK_DATE   = new Size( 40,  18)
const SIZE_STACK_ALERT  = new Size( 40,  10)
const SIZE_STACK_BDAY   = new Size( 40,  15)
const SIZE_STACK_BDATE  = new Size( 40,  25)

// event stack sizes
const SIZE_STACK_ADE    = new Size(145,  14)
const SIZE_STACK_EVENT  = new Size(145,  24)
const SIZE_STACK_ETIME  = new Size( 50,  24)
const SIZE_STACK_ETIMEP = new Size( 50,  12)
const SIZE_STACK_ENAME  = new Size( 95,  24)

// reminder stack sizes
const SIZE_STACK_RNAME  = new Size(145, 18)

// habit stack sizes
const SIZE_STACK_HB     = new Size( 10,  10)
const SIZE_DOT          = 50
const SIZE_ACTUAL_DOT   = new Size(  4,   4)

// fonts
const FONT_DAY          = Font.regularMonospacedSystemFont(8)
const FONT_DATE         = Font.mediumSystemFont(18)
const FONT_ALERT        = Font.mediumSystemFont(8)
const FONT_BDAY         = Font.semiboldMonospacedSystemFont(11)
const FONT_BDATE        = Font.semiboldSystemFont(28)
const FONT_ADE          = Font.boldMonospacedSystemFont(12)
const FONT_ENAME        = Font.semiboldMonospacedSystemFont(13)
const FONT_ETIME        = Font.regularMonospacedSystemFont(10)
const FONT_RNAME        = Font.semiboldMonospacedSystemFont(14)
const FONT_REMAINDER    = Font.mediumMonospacedSystemFont(12)

// date formats
const DF_DAY  = new DateFormatter()
DF_DAY.dateFormat = "E"
const DF_DATE = new DateFormatter()
DF_DATE.dateFormat = "d"
const DF_TIME = new DateFormatter()
DF_TIME.dateFormat = "HH:mm"

// shortcut URL
const SHORTCUT = "shortcuts://run-shortcut?name="

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

function addText(stack, bg_color, content, font, color)
{
  const text = stack.addText(content)

  stack.centerAlignContent()
  stack.backgroundColor = bg_color
  text.centerAlignText()
  text.font = font
  text.textColor = color
}

function addRemainder(stack, events, limit, postfix_str)
{
  const stack_pad = addStack(stack, SIZE_STACK_PAD, COLOR_WHITE)
  const stack_r   = addStack(stack,  SIZE_STACK_RS, COLOR_WHITE)

  if (events.length > limit)
  {
    const postfix = events.length - limit == 1 ? postfix_str + "..." : postfix_str + "s..."
    addText(stack_r, COLOR_WHITE, "+" + (events.length - limit) + " more " + postfix, FONT_REMAINDER, COLOR_BG)
  }
}

function addReminder(stack, reminders, idx)
{
  const stack_pad = addStack(stack,   SIZE_STACK_PAD, COLOR_WHITE)
  const stack_r   = addStack(stack, SIZE_STACK_RNAME, COLOR_WHITE)

  if (reminders.length > idx)
    addText(stack_r, COLOR_WHITE, reminders[idx].name, FONT_RNAME, COLOR_BG)
}

function addEvent(stack, events, idx)
{
  const stack_pad   = addStack(      stack,    SIZE_STACK_PAD, COLOR_WHITE)
  const stack_event = addStack(      stack,  SIZE_STACK_EVENT, COLOR_WHITE)
  const stack_time  = addStack(stack_event,  SIZE_STACK_ETIME, COLOR_WHITE)
  const stack_name  = addStack(stack_event,  SIZE_STACK_ENAME, COLOR_WHITE)
  stack_time.layoutVertically()
  const stack_stime = addStack( stack_time, SIZE_STACK_ETIMEP, COLOR_WHITE)
  const stack_etime = addStack( stack_time, SIZE_STACK_ETIMEP, COLOR_WHITE)

  if (events.length > idx)
  {
    addText(stack_stime, COLOR_BG, DF_TIME.string(events[idx].startDate), FONT_ETIME, COLOR_WHITE)
    addText(stack_etime, COLOR_BG,   DF_TIME.string(events[idx].endDate), FONT_ETIME, COLOR_WHITE)
    addText( stack_name, COLOR_BG,                      events[idx].name, FONT_ENAME, COLOR_WHITE)
    stack_name.addSpacer()
  }
}

function addAllDayEvent(stack, events, idx)
{
  const stack_pad   = addStack(stack, SIZE_STACK_PAD, COLOR_WHITE)
  const stack_event = addStack(stack, SIZE_STACK_ADE, COLOR_WHITE)

  if (events.length > idx)
    addText(stack_event, COLOR_BG, events[idx].name, FONT_ADE, COLOR_WHITE)
}

function pushEvent(events, evnt)
{
  events.push
  ({
    id: evnt.identifier,
    name: evnt.title,
    startDate: evnt.startDate,
    endDate: evnt.endDate,
  })
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

function drawHabit(stack, reminders)
{
  for (let i = 0; i < 28; ++i)
  {
//    const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
    const stack_block = addStack(stack, SIZE_STACK_HB, COLOR_WHITE)
//    let exercise_complete = false
//
//    // check if a reminder was completed
//    let today_reminders = []
//    for (const reminder of reminders)
//      if (
//        reminder.title == "Exercise" &&
//        reminder.dueDate.getDate() == date.getDate() &&
//        reminder.dueDate.getMonth() == date.getMonth() &&
//        reminder.dueDate.getFullYear() == date.getFullYear()
//      )
//        exercise_complete = true
//
//    if (exercise_complete)
//      drawDot(stack_block, /*dot_resolution*/ 50, SIZE_ACTUAL_DOT, COLOR_WHITE)
    drawDot(stack_block, /*dot_resolution*/ 50, SIZE_ACTUAL_DOT, COLOR_BG)
  }
}

function drawHabits(stack, reminders)
{
  // create stacks for each habit category
  stack.layoutVertically()
  const stack_s = addStack(stack, SIZE_STACK_HC, COLOR_WHITE) // supplements
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_e = addStack(stack, SIZE_STACK_HC, COLOR_WHITE) // excercise
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_i = addStack(stack, SIZE_STACK_HC, COLOR_WHITE) // self improvements
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_l = addStack(stack, SIZE_STACK_HC, COLOR_WHITE) // ledger
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_c = addStack(stack, SIZE_STACK_HC, COLOR_WHITE) // cool downs

  drawHabit(stack_s, reminders)
  drawHabit(stack_e, reminders)
  drawHabit(stack_i, reminders)
  drawHabit(stack_l, reminders)
  drawHabit(stack_c, reminders)
}

function drawReminders(stack, reminders)
{
  // find today's reminders
  const today = new Date()
  let today_reminders = []
  for (const reminder of reminders)
  {
    if (
      !reminder.isCompleted && reminder.dueDate != null &&
      reminder.dueDate.getDate() == today.getDate() &&
      reminder.dueDate.getMonth() == today.getMonth() &&
      reminder.dueDate.getFullYear() == today.getFullYear()
    )
    {
      today_reminders.push
      ({
          id: reminder.identifier,
          name: reminder.title,
          dd: reminder.dueDate
      })
    }
  }
  // sort reminders in ascending order
  today_reminders.sort((a, b) => a.dd - b.dd)

  stack.layoutVertically()
  addReminder(stack, today_reminders, 0)
  addReminder(stack, today_reminders, 1)
  addReminder(stack, today_reminders, 2)
  addReminder(stack, today_reminders, 3)
  addReminder(stack, today_reminders, 4)
  addReminder(stack, today_reminders, 5)
  addReminder(stack, today_reminders, 6)
  addReminder(stack, today_reminders, 7)
  addRemainder(stack, today_reminders, 8, "reminder")
}

function drawEvents(stack, events)
{
  // find today's events
  const today = new Date()
  let today_ades = []
  let today_events = []
  for (const evnt of events)
  {
    const text_sevent = DF_TIME.string(evnt.startDate)
    const text_eevent = DF_TIME.string(evnt.endDate)
    const scompare = text_sevent.localeCompare("00:00")
    const ecompare = text_eevent.localeCompare("23:59")

    if (scompare == 0 && ecompare == 0)
      pushEvent(today_ades, evnt)
    else if (evnt.startDate.getTime() > today.getTime())
      pushEvent(today_events, evnt)
  }

  stack.layoutVertically()
  addAllDayEvent(stack, today_ades, 0)
  addAllDayEvent(stack, today_ades, 1)
  addEvent(stack, today_events, 0)
  addEvent(stack, today_events, 1)
  addEvent(stack, today_events, 2)
  addEvent(stack, today_events, 3)
  addEvent(stack, today_events, 4)
  addStack(stack, new Size(145, 2), COLOR_WHITE)
  addRemainder(stack, today_events, 5, "event")
}

function drawDates(stack, events, reminders)
{
  for (let i = 0; i < 7; ++i)
  {
    const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
    const stack_block = addStack(stack, SIZE_STACK_DB, COLOR_BG)

    // calculate number of events in a specific date
    let today_events = []
    for (const evnt of events)
      if (evnt.startDate.getDate() == date.getDate())
        today_events.push({ id: evnt.identifier })

    // create day, date, and alert stack
    stack_block.layoutVertically()
    if (i == 0)
    {
      const stack_day   = addStack(stack_block,  SIZE_STACK_BDAY, COLOR_WHITE)
      const stack_date  = addStack(stack_block, SIZE_STACK_BDATE, COLOR_WHITE)

      addText(  stack_day, COLOR_WHITE,  DF_DAY.string(date),  FONT_BDAY, COLOR_BG)
      addText( stack_date, COLOR_WHITE, DF_DATE.string(date), FONT_BDATE, COLOR_BG)
    }
    else
    {
      const stack_day   = addStack(stack_block,   SIZE_STACK_DAY, COLOR_WHITE)
      const stack_date  = addStack(stack_block,  SIZE_STACK_DATE, COLOR_WHITE)
      const stack_alert = addStack(stack_block, SIZE_STACK_ALERT, COLOR_WHITE)

      addText(  stack_day, COLOR_WHITE,       DF_DAY.string(date),   FONT_DAY, COLOR_BG)
      addText( stack_date, COLOR_WHITE,      DF_DATE.string(date),  FONT_DATE, COLOR_BG)
      addText(stack_alert, COLOR_WHITE, "+" + today_events.length, FONT_ALERT, COLOR_BG)
    }
  }
}

async function buildLargeWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()

  // add major stacks
  stack.layoutVertically()
  const stack_d = addStack(stack, SIZE_STACK_D, COLOR_WHITE) // date stack
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_c = addStack(stack, SIZE_STACK_C, COLOR_WHITE) // content (event + reminder) stack
  addLine(stack, SIZE_STACK_L, COLOR_WHITE)
  const stack_h = addStack(stack, SIZE_STACK_H, COLOR_WHITE) // habit stack

  // create event and reminder stack within content stack
  addStack(stack_c, SIZE_STACK_P, COLOR_WHITE)
  const stack_e = addStack(stack_c, SIZE_STACK_E, COLOR_BG)
  addStack(stack_c, SIZE_STACK_P, COLOR_WHITE)
  const stack_r = addStack(stack_c, SIZE_STACK_R, COLOR_BG)
  addStack(stack_c, SIZE_STACK_P, COLOR_WHITE)

  drawDates(stack_d, events, reminders)
  drawEvents(stack_e, events)
  drawReminders(stack_r, reminders)
  drawHabits(stack_h, reminders)

  // link calendar and reminder applications
  stack_e.url = SHORTCUT + "calendar"
  stack_r.url = SHORTCUT + "reminders"

  return widget
}

const widget = await buildLargeWidget()
widget.backgroundColor = COLOR_WHITE
Script.setWidget(widget)
Script.complete()
