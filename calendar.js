const COLOR_BG = new Color("242424", 1)
const COLOR_TEXT_BG = new Color("183b61", 1)
const COLOR_TEXT = new Color("54a7ff", 1)

const FONT_DAY = Font.regularMonospacedSystemFont(13)
const FONT_DATE = Font.mediumSystemFont(30)
const FONT_EVENT = Font.semiboldMonospacedSystemFont(15)
const FONT_TIME = Font.regularMonospacedSystemFont(10)

const SIZE_STACK = new Size(150, 0)

async function buildWidget()
{
  const widget = new ListWidget()
  widget.backgroundColor = COLOR_BG

  const today = new Date()

  let events_today = []
  const events = await CalendarEvent.today([])
  for (const event of events)
  {
    if (event.endDate.getTime() > today.getTime())
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

  const stack_layout = widget.addStack()
  stack_layout.layoutVertically()

  const stack_day = stack_layout.addStack()
  const stack_date = stack_layout.addStack()
  stack_layout.addSpacer()
  const stack_event0 = stack_layout.addStack()
  const stack_time0 = stack_layout.addStack()
  stack_layout.addSpacer()
  const stack_event1 = stack_layout.addStack()
  const stack_time1 = stack_layout.addStack()
  stack_layout.addSpacer()
  const stack_summary = stack_layout.addStack()

  stack_event0.size = SIZE_STACK
  stack_time0.size = SIZE_STACK
  stack_event1.size = SIZE_STACK
  stack_time1.size = SIZE_STACK

  const df_day = new DateFormatter()
  df_day.dateFormat = "E"
  const df_date = new DateFormatter()
  df_date.dateFormat = "d"
  const df_event = new DateFormatter()
  df_event.dateFormat = "HH:mm"

  const text_day = stack_day.addText(df_day.string(today))
  text_day.font = FONT_DAY
  text_day.centerAlignText()

  const text_date = stack_date.addText(df_date.string(today))
  text_date.font = FONT_DATE
  text_date.leftAlignText()
  stack_date.addSpacer()

  if (events_today.length > 0)
  {
    stack_event0.backgroundColor = COLOR_TEXT_BG
    stack_time0.backgroundColor = COLOR_TEXT_BG

    const text_event0 = stack_event0.addText(events_today[0].name)
    text_event0.font = FONT_EVENT
    text_event0.textColor = COLOR_TEXT

    const text_time0_start = df_event.string(events_today[0].startDate)
    const text_time0_end = df_event.string(events_today[0].endDate)
    const text_time0 = stack_time0.addText(text_time0_start + " ~ " + text_time0_end)
    text_time0.font = FONT_TIME
    text_time0.textColor = COLOR_TEXT
  }
  else
  {
    const text_event0 = stack_event0.addText("event0")
    text_event0.textOpacity = 0

    const text_time0 = stack_time0.addText("time0")
    text_time0.font = FONT_TIME
    text_time0.textOpacity = 0
  }

  if (events_today.length > 1)
  {
    stack_event1.backgroundColor = COLOR_TEXT_BG
    stack_time1.backgroundColor = COLOR_TEXT_BG

    const text_event1 = stack_event1.addText(events_today[1].name)
    text_event1.font = FONT_EVENT
    text_event1.textColor = COLOR_TEXT

    const text_time1_start = df_event.string(events_today[1].startDate)
    const text_time1_end = df_event.string(events_today[1].endDate)
    const text_time1 = stack_time1.addText(text_time1_start + " ~ " + text_time1_end)
    text_time1.font = FONT_TIME
    text_time1.textColor = COLOR_TEXT
  }
  else
  {
    const text_event1 = stack_event1.addText("event1")
    text_event1.textOpacity = 0

    const text_time1 = stack_time1.addText("time1")
    text_time1.font = FONT_TIME
    text_time1.textOpacity = 0
  }

  if (events_today.length == 3)
  {
    const count = events_today.length - 2
    const text_summary = stack_summary.addText("... +1 more event")
    text_summary.font = FONT_TIME
  }
  else if (events_today.length > 3)
  {
    const count = events_today.length - 2
    const text_summary = stack_summary.addText("... +" + count + " more events")
    text_summary.font = FONT_TIME
  }
  else
  {
    const text_summary = stack_summary.addText("leftovers")
    text_summary.font = FONT_TIME
    text_summary.textOpacity = 0
  }

  return widget
}

const widget = await buildWidget()
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
