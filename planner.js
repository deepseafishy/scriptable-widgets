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

const SIZE_STACK_DATE = new Size( 40,  40)

//function drawDot(size, color) {
//  const ctx = new DrawContext()
//  ctx.size = new Size(size, size)
//  ctx.opaque = false
//  ctx.setFillColor(color)
//  ctx.fillEllipse(new Rect(0, 0, size, size))
//  return ctx.getImage()
//}

function drawDate(stack, date)
{
  const stack_date = stack.addStack()
  stack_date.size = SIZE_STACK_DATE
  stack_date.backgroundColor = COLOR_BG
  const stack_temp = stack.addStack()
  stack_temp.size = new Size(2, 40)
  stack_temp.backgroundColor = COLOR_WHITE
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
