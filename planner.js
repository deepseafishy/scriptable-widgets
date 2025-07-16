const COLOR_BG     = new Color("242424", 1)
const COLOR_WHITE  = new Color("FFFFFF", 1)
const COLOR_PURPLE = new Color("8C107A", 1)
const COLOR_GREEN  = new Color("518E18", 1)
const COLOR_ORANGE = new Color("FF671E", 1)

const SIZE_TOTAL   = new Size(160, 150)
const SIZE_STACK_D = new Size( 40, 150)
const SIZE_STACK_E = new Size( 10, 150)
const SIZE_STACK_L = new Size(  2, 150)
const SIZE_STACK_C = new Size(110, 150)

//function drawDot(size, color) {
//  const ctx = new DrawContext()
//  ctx.size = new Size(size, size)
//  ctx.opaque = false
//  ctx.setFillColor(color)
//  ctx.fillEllipse(new Rect(0, 0, size, size))
//  return ctx.getImage()
//}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()
  const events = await CalendarEvent.today([])
  const reminders = await Reminder.all([])
  const today = new Date()

  stack.layoutHorizontally()
  const stack_d = stack.addStack() // dates 40
  const stack_e = stack.addStack() // excercise 10
  const stack_l = stack.addStack() // line 2
  const stack_c = stack.addStack() // contents 110

  stack_d.size = SIZE_STACK_D
  stack_d.backgroundColor = COLOR_PURPLE
  stack_e.size = SIZE_STACK_E
  stack_e.backgroundColor = COLOR_GREEN
  stack_l.size = SIZE_STACK_L
  stack_l.backgroundColor = COLOR_WHITE
  stack_c.size = SIZE_STACK_C
  stack_c.backgroundColor = COLOR_ORANGE

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
