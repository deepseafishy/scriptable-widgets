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
const SIZE_STACK_DAY   = new Size( 40,  10)
const SIZE_STACK_DATE  = new Size( 40,  20)
const SIZE_STACK_ALERT = new Size( 40,  10)

const FONT_DAY         = Font.regularMonospacedSystemFont(8)
const FONT_DATE        = Font.mediumSystemFont(20)
const FONT_ALERT       = Font.mediumSystemFont(8)

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

function addWhiteText(stack, content, font)
{
  const text = stack.addText(content)

  stack.centerAlignContent()
  text.centerAlignText()
  text.font = font
  text.textColor = COLOR_WHITE
}

function addStack(stack, size, color)
{
  const stack_child = stack.addStack()

  stack_child.size = size
  stack_child.backgroundColor = color

  return stack_child
}

function drawDates(stack)
{
  for (let i = 0; i < 7; ++i)
  {
    // create date
    const date = new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
    // create block stack
    const stack_block = addStack(      stack, SIZE_STACK_BLOCK, COLOR_BG)

    // create day, date, and alert stack
    stack_block.layoutVertically()
    const stack_day   = addStack(stack_block,   SIZE_STACK_DAY, COLOR_BG)
    const stack_date  = addStack(stack_block,  SIZE_STACK_DATE, COLOR_BG)
    const stack_alert = addStack(stack_block, SIZE_STACK_ALERT, COLOR_BG)

    // add content to day, date, and alert stacks
    addWhiteText(  stack_day,  DF_DAY.string(date),   FONT_DAY)
    addWhiteText( stack_date, DF_DATE.string(date),  FONT_DATE)
    addWhiteText(stack_alert,                "+11", FONT_ALERT)
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
  // create dates, excercises, line, and contents stack
  const stack_d = addStack(stack, SIZE_STACK_D, COLOR_BG)
  const stack_e = stack.addStack()
  const stack_l = stack.addStack()
  const stack_c = stack.addStack()

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
