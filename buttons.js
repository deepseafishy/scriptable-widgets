// colors
const COLOR_BG          = new Color("242424", 1)
const COLOR_WHITE       = new Color("FFFFFF", 1)
const COLOR_GRAY        = new Color("808080", 1)

// major stack sizes
// const SIZE_TOTAL     = new Size(320, 320)
const SIZE_ROW          = new Size(320,  35)
const SIZE_ICON         = new Size( 35,  35)
const SIZE_COL_PAD      = new Size(  1,  35)
const SIZE_ROW_PAD      = new Size( 35,   1)
const SIZE_NULL         = new Size(  0,   0)

// fonts
// const FONT_DAY          = Font.regularMonospacedSystemFont(8)
// const FONT_DATE         = Font.mediumSystemFont(18)
// const FONT_ALERT        = Font.mediumSystemFont(8)
// const FONT_BDAY         = Font.semiboldMonospacedSystemFont(11)
// const FONT_BDATE        = Font.semiboldSystemFont(28)
// const FONT_ADE          = Font.boldMonospacedSystemFont(12)
// const FONT_ENAME        = Font.semiboldMonospacedSystemFont(13)
// const FONT_ETIME        = Font.regularMonospacedSystemFont(10)
// const FONT_RNAME        = Font.semiboldMonospacedSystemFont(14)
// const FONT_REMAINDER    = Font.mediumMonospacedSystemFont(12)

function addText(stack, bg_color, content, font, color)
{
  const text = stack.addText(content)

  stack.centerAlignContent()
  stack.backgroundColor = bg_color
  text.centerAlignText()
  text.font = font
  text.textColor = color
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

  if (size.width != 0 && size.height != 0)
  {
    stack_child.size = size
    stack_child.backgroundColor = color
  }

  return stack_child
}

function addRowStack(stack, row_idx, add_pad)
{
  const size_pad = add_pad ? SIZE_ROW_PAD : SIZE_NULL
  const stack_row = addStack(stack, SIZE_ROW, COLOR_GRAY)
  const stack_pad = addStack(stack, size_pad,   COLOR_BG)

  addStack(  stack_row,    SIZE_ICON, COLOR_WHITE)
  for (let c = 0; c < 8; c++)
  {
    addStack(stack_row, SIZE_COL_PAD, COLOR_BG)
    addStack(stack_row,    SIZE_ICON, COLOR_WHITE)
  }
}

async function buildLargeWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()

  stack.layoutVertically()
  for (let i = 0; i < 9; i++)
    addRowStack(stack, i, i < 8)

  return widget
}

const widget = await buildLargeWidget()
widget.backgroundColor = COLOR_BG
Script.setWidget(widget)
Script.complete()
