// file manage
const FM            = FileManager.iCloud()
// colors
const COLOR_BG      = new Color("242424", 1)
const COLOR_WHITE   = new Color("FFFFFF", 1)
const COLOR_GRAY    = new Color("808080", 1)
// sizes
// const SIZE_MED  = new Size(320, 160)
const SIZE_ROW     = new Size(320,  50)
const SIZE_ICON    = new Size( 50,  50)
const SIZE_COL_PAD = new Size(  1,  50)
const SIZE_ROW_PAD = new Size( 50,   1)
const SIZE_NULL    = new Size(  0,   0)
// dimensions
const N_ROWS = 3
const N_COLS = 6
// shortcut URL
const SHORTCUT      = "shortcuts://run-shortcut?name="
// applications
const apps          =
[
  [    "series",   "webtoon",    "youtube",      "steam",        "",          "", "", "", ""],
  [ "naver_map", "kakao_map",  "kakao_bus",     "baemin",  "subway",       "nol", "", "", ""],
  [    "camera",    "photos", "calculator", "voice_memo", "shazaam", "app_store", "", "", ""],
]

function addImage(stack, size, name)
{
  const path = FM.joinPath(FM.documentsDirectory(), name + ".PNG")

  if (FM.fileExists(path))
  {
    FM.downloadFileFromiCloud(path)
    const img = FM.readImage(path)
    const stack_img = stack.addImage(img)
    stack_img.size = size
  }
  else if (name != "")
  {
    stack.addText(name)
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
  const stack_row = addStack(stack, SIZE_ROW, COLOR_BG)
  const stack_pad = addStack(stack, size_pad, COLOR_BG)

  for (let col = 0; col < N_COLS; col++)
    addIcon(stack_row, SIZE_ICON, COLOR_BG, apps[row][col], col < N_COLS - 1)
}

async function buildMediumWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()

  stack.layoutVertically()
  for (let i = 0; i < N_ROWS; i++)
    addRowStack(stack, i, i < N_ROWS - 1)

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
Script.setWidget(widget)
Script.complete()
