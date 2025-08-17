// file manage
const FM            = FileManager.iCloud()
// colors
const COLOR_BG      = new Color("242424", 1)
const COLOR_WHITE   = new Color("FFFFFF", 1)
const COLOR_GRAY    = new Color("808080", 1)
// sizes
// const SIZE_TOTAL = new Size(320, 320)
const SIZE_ROW      = new Size(320,  35)
const SIZE_ICON     = new Size( 35,  35)
const SIZE_COL_PAD  = new Size(  1,  35)
const SIZE_ROW_PAD  = new Size( 35,   1)
const SIZE_NULL     = new Size(  0,   0)
// dimensions
const N_ROWS = 9
const N_COLS = 9
// shortcut URL
const SHORTCUT      = "shortcuts://run-shortcut?name="
// applications
const apps = [
  ["imessage", "kakaotalk", "slack", "mail", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
]

function addImage(stack, size, name)
{
  const path = FM.joinPath(FM.documentsDirectory(), name + ".PNG")
  let img

  if (FM.fileExists(path))
  {
    FM.downloadFileFromiCloud(path)
    img = stack.addImage(path)
    img.size = size
  }
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

function addIcon(stack, size, color, name, add_pad)
{
  const size_pad = add_pad ? SIZE_COL_PAD : SIZE_NULL
  const stack_icon = stack.addStack()
  const stack_pad = addStack(stack, size_pad, COLOR_BG)

  if (size.width != 0 && size.height != 0)
  {
    stack_icon.size = size
    stack_icon.backgroundColor = color
    stack_icon.url = SHORTCUT + name
    addImage(stack_icon, SIZE_ICON, name)
  }

  return stack_icon
}

function addRowStack(stack, row, add_pad)
{
  const size_pad = add_pad ? SIZE_ROW_PAD : SIZE_NULL
  const stack_row = addStack(stack, SIZE_ROW, COLOR_GRAY)
  const stack_pad = addStack(stack, size_pad,   COLOR_BG)

  for (let col = 0; col < N_COLS; col++)
    addIcon(stack_row, SIZE_ICON, COLOR_BG, apps[row][col], col < N_COLS - 1)
}

async function buildLargeWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()

  stack.layoutVertically()
  for (let i = 0; i < N_ROWS; i++)
    addRowStack(stack, i, i < N_ROWS - 1)

  return widget
}

const widget = await buildLargeWidget()
widget.backgroundColor = COLOR_BG
Script.setWidget(widget)
Script.complete()
