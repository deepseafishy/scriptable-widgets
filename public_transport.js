// colors
const COLOR_BLACK = new Color("242424", 1)
const COLOR_WHITE = new Color("FFFFFF", 1)
const COLOR_GRAY  = new Color("808080", 1)
const COLOR_BLUE  = new Color("808080", 1)
const COLOR_GREEN = new Color("808080", 1)
const COLOR_BG    = COLOR_BLACK
const COLOR_FG    = COLOR_WHITE

// major stack sizes
const SIZE_TOTAL  = new Size(320, 320)
const SIZE_LINE   = new Size(320,  20)
const SIZE_2LRPAD = new Size( 20,  20)
const SIZE_ARROW  = new Size( 20,  20)
const SIZE_STOP   = new Size(120,  20)
const SIZE_STOP_T = new Size(120,  10)
const SIZE_STOP_B = new Size(120,  10)

// fonts
const FONT_STOP_T = Font.mediumSystemFont(18)

// string constants
// http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute?ServiceKey=인증키&stId=112000001&busRouteId=100100118&ord=18
API_KEY = ""
REQUEST = "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute?ServiceKey=" + API_KEY

// BUS 650
// 100100097 650 14 115000078 16175 등촌2동주민센터.등촌동대림아파트 126.8629699 37.54194247

function stId(id) { return "&stId=" + id }
function busRouteId(id) { return "&busRouteId=" + id }
function ord(id) { return "&ord=" + id }

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

  stack_child.size = size
  stack_child.backgroundColor = color

  return stack_child
}

function addStop(stack)
{
  stack.layoutVertically()
  const stop_top = addStack(stack, SIZE_STOP_T, COLOR_BG)
  const stop_bot = addStack(stack, SIZE_STOP_B, COLOR_BG)

  addText(stop_top, COLOR_WHITE, "650", FONT_STOP_T, COLOR_BG)

  url = REQUEST + stId("100100097") + busRouteId("115000078") + ord("14")
  let req = new Request(url);
}

function addThreeStops(stack)
{
  const l_pad  = addStack(stack, SIZE_2LRPAD, COLOR_BG)
  const stop0  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const arrow0 = addStack(stack,  SIZE_ARROW, COLOR_BG)
  const stop1  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const arrow1 = addStack(stack,  SIZE_ARROW, COLOR_BG)
  const stop2  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const r_pad  = addStack(stack, SIZE_2LRPAD, COLOR_BG)

  addStop(stop0)
}

async function buildLargeWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()

  stack.layoutVertically()
  const stack0 = addStack(stack, SIZE_LINE, COLOR_BG)
  addThreeStops(stack0)

  return widget
}

const widget = await buildLargeWidget()
widget.backgroundColor = COLOR_BG
Script.setWidget(widget)
Script.complete()
