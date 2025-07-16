const COLOR_BG     = new Color("242424", 1)
const COLOR_WHITE  = new Color("FFFFFF", 1)
const COLOR_PURPLE = new Color("8C107A", 1)
const COLOR_GREEN  = new Color("518E18", 1)
const COLOR_ORANGE = new Color("FF671E", 1)

const SIZE_TOTAL   = new Size(320, 160)
const SIZE_STACK_D = new Size(320,  40)
const SIZE_STACK_E = new Size(320,  10)
const SIZE_STACK_L = new Size(320,   2)
const SIZE_STACK_C = new Size(320, 110)

const SIZE_STACK_BLOCK = new Size( 40,  40)
const SIZE_STACK_DATE  = new Size( 40,  10)
const SIZE_STACK_DAY   = new Size( 40,  20)
const SIZE_STACK_ALERT = new Size( 40,  10)

const FONT_DAY         = Font.regularMonospacedSystemFont(5)
const FONT_DATE        = Font.mediumSystemFont(20)
const FONT_ALERT       = Font.mediumSystemFont(5)

const DF_DAY  = new DateFormatter()
DF_DAY.dateFormat = "E"
const DF_DATE = new DateFormatter()
DF_DATE.dateFormat = "d"
const DF_TIME = new DateFormatter()
DF_TIME.dateFormat = "HH:mm"

//function drawDot(size, color) {
//  const ctx = new DrawContext()
//  ctx.size = new Size(size, size)
//  ctx.opaque = false
//  ctx.setFillColor(color)
//  ctx.fillEllipse(new Rect(0, 0, size, size))
//  return ctx.getImage()
//}

function drawDate(stack, offset)
{
  const date = new Date(new Date().getTime() + offset * 24 * 60 * 60 * 1000)
  const stack_block = stack.addStack()

  stack_block.layoutVertically()
  stack_block.size = SIZE_STACK_BLOCK
  stack_block.backgroundColor = COLOR_BG

  const stack_day = stack_block.addStack()
  const stack_date = stack_block.addStack()
  const stack_alert = stack_block.addStack()

  stack_day.size = SIZE_STACK_DAY
  stack_date.size = SIZE_STACK_DATE
  stack_alert.size = SIZE_STACK_ALERT

  const text_day = stack_day.addText(DF_DAY.string(date))
  const text_date = stack_day.addText(DF_DATE.string(date))
  const text_alert = stack_day.addText("+11")

  text_day.textColor = COLOR_WHITE
  text_day.font = FONT_DAY
  text_date.textColor = COLOR_WHITE
  text_date.font = FONT_DATE
  text_alert.textColor = COLOR_WHITE
  text_alert.font = FONT_ALERT 
}

function drawDates(stack)
{
  for (let i = 0; i < 7; ++i)
    drawDate(stack, i)
}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()

  stack.layoutVertically()
  const stack_d = stack.addStack() // dates
  const stack_e = stack.addStack() // excercise
  const stack_l = stack.addStack() // line
  const stack_c = stack.addStack() // contents

  stack_d.size = SIZE_STACK_D
  stack_d.backgroundColor = COLOR_PURPLE
  stack_e.size = SIZE_STACK_E
  stack_e.backgroundColor = COLOR_GREEN
  stack_l.size = SIZE_STACK_L
  stack_l.backgroundColor = COLOR_WHITE
  stack_c.size = SIZE_STACK_C
  stack_c.backgroundColor = COLOR_ORANGE

  drawDates(stack_d)

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
