// colors
const COLOR_BLACK = new Color("242424", 1)
const COLOR_WHITE = new Color("FFFFFF", 1)
const COLOR_GRAY  = new Color("808080", 1)
const COLOR_BLUE  = new Color("808080", 1)
const COLOR_GREEN = new Color("808080", 1)
const COLOR_FG    = COLOR_BLACK
const COLOR_BG    = COLOR_WHITE

// major stack sizes
const SIZE_TOTAL  = new Size(320, 320)
const SIZE_LINE   = new Size(320,  20)
const SIZE_2LRPAD = new Size( 20,  20)
const SIZE_ARROW  = new Size( 20,  20)
const SIZE_STOP   = new Size(120,  20)
const SIZE_STOP_T = new Size(120,  10)
const SIZE_STOP_B = new Size(120,  10)

// fonts
const FONT_STOP_T = Font.mediumSystemFont(10)

// string constants
API_KEY = ""
REQUEST = "http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRoute?serviceKey=" + API_KEY

// bus stop information
let stops = {
  "0650_dcd" = ["115000078", "100100097", "14"], // DeungChonDong, 등촌2동주민센터
  "5516_nrj" = ["119000097", "100100253", "41"], // NoRyangJin, 노량진초등학교앞
}

function stId(id) { return "&stId=" + id }
function busRouteId(id) { return "&busRouteId=" + id }
function ord(id) { return "&ord=" + id }
function resultType(type) { return "&resultType=" + type }

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

function addStop(stack, bus, arr)
{
  stack.layoutVertically()
  const stop_top = addStack(stack, SIZE_STOP_T, COLOR_BG)
  const stop_bot = addStack(stack, SIZE_STOP_B, COLOR_BG)

  addText(stop_top, COLOR_BG, bus, FONT_STOP_T, COLOR_FG)
  addText(stop_bot, COLOR_BG, arr, FONT_STOP_T, COLOR_FG)
}

function addThreeStops(stack, stop0_bus, stop0_arr, stop1_bus, stop1_arr, stop2_bus, stop2_arr)
{
  const l_pad  = addStack(stack, SIZE_2LRPAD, COLOR_BG)
  const stop0  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const arrow0 = addStack(stack,  SIZE_ARROW, COLOR_BG)
  const stop1  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const arrow1 = addStack(stack,  SIZE_ARROW, COLOR_BG)
  const stop2  = addStack(stack,   SIZE_STOP, COLOR_BG)
  const r_pad  = addStack(stack, SIZE_2LRPAD, COLOR_BG)

  addStop(stop0, stop0_bus, stop0_arr)
  addStop(stop1, stop1_bus, stop1_arr)
  addStop(stop2, stop2_bus, stop2_arr)
}

async function getStopInfo(key)
{
  let url = REQUEST + stId(stops[key][0]) + busRouteId(stops[key][1]) + ord(stops[key][2]) + resultType("json")
  let req = new Request(url)
  let result = await req.loadJSON()

  return result.msgBody.itemList[0].arrmsg1
}

async function buildLargeWidget()
{
  const widget = new ListWidget()
  const stack = widget.addStack()

  // add stacks for each routes
  stack.layoutVertically()
  const stack0 = addStack(stack, SIZE_LINE, COLOR_BG)

  // show route
  stop0 = await getStopInfo("0650_dcd")
  stop1 = await getStopInfo("5516_nrj")
  addThreeStops(stack0, "650", stop0, "5516", stop1, "DEST", "SNU")

  return widget
}

const widget = await buildLargeWidget()
widget.backgroundColor = COLOR_BG
Script.setWidget(widget)
Script.complete()
