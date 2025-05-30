const COLOR_BG = new Color("242424", 1)
const COLOR_TEXT = new Color("FFFFFF", 1)

const FONT_REMINDER = Font.semiboldSystemFont(15)
const FONT_SUMMARY= Font.semiboldSystemFont(10)

const SIZE_STACK = new Size(169, 0)

async function buildReminder()
{
}

async function buildMediumWidget()
{
  const widget = new ListWidget()

  const today = new Date()

  let reminders_today = []
  const reminders = await Reminder.all([])
  for (const reminder of reminders)
  {
    if (!reminder.isCompleted &&
        reminder.dueDate != null &&
        reminder.dueDate.getDate() == today.getDate())
    {
      reminders_today.push
      ({
          id: reminder.identifier,
          name: reminder.title,
      })
    }
  }

  const stack_layout = widget.addStack()
  stack_layout.layoutVertically()

  const stack_rms04 = stack_layout.addStack()
  stack_rms04.layoutHorizontally()
  stack_layout.addSpacer()
  const stack_rms15 = stack_layout.addStack()
  stack_rms15.layoutHorizontally()
  stack_layout.addSpacer()
  const stack_rms26 = stack_layout.addStack()
  stack_rms26.layoutHorizontally()
  stack_layout.addSpacer()
  const stack_rms37 = stack_layout.addStack()
  stack_rms37.layoutHorizontally()
  stack_layout.addSpacer()
  const stack_summary = stack_layout.addStack()
  stack_summary.layoutHorizontally()

  const stack_rm0 = stack_rms04.addStack()
  const stack_rm4 = stack_rms04.addStack()
  const stack_rm1 = stack_rms15.addStack()
  const stack_rm5 = stack_rms15.addStack()
  const stack_rm2 = stack_rms26.addStack()
  const stack_rm6 = stack_rms26.addStack()
  const stack_rm3 = stack_rms37.addStack()
  const stack_rm7 = stack_rms37.addStack()

  stack_rm0.size = SIZE_STACK
  stack_rm1.size = SIZE_STACK
  stack_rm2.size = SIZE_STACK
  stack_rm3.size = SIZE_STACK
  stack_rm4.size = SIZE_STACK
  stack_rm5.size = SIZE_STACK
  stack_rm6.size = SIZE_STACK
  stack_rm7.size = SIZE_STACK

  if (reminders_today.length > 0)
  {
    const text_rm0 = stack_rm0.addText(reminders_today[0].name)
    text_rm0.font = FONT_REMINDER
    text_rm0.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm0 = stack_rm0.addText("reminder0")
    text_rm0.font = FONT_REMINDER
    text_rm0.textOpacity = 0
  }
  stack_rm0.addSpacer()

  if (reminders_today.length > 1)
  {
    const text_rm1 = stack_rm1.addText(reminders_today[1].name)
    text_rm1.font = FONT_REMINDER
    text_rm1.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm1 = stack_rm1.addText("reminder1")
    text_rm1.font = FONT_REMINDER
    text_rm1.textOpacity = 0
  }
  stack_rm1.addSpacer()

  if (reminders_today.length > 2)
  {
    const text_rm2 = stack_rm2.addText(reminders_today[2].name)
    text_rm2.font = FONT_REMINDER
    text_rm2.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm2 = stack_rm2.addText("reminder2")
    text_rm2.font = FONT_REMINDER
    text_rm2.textOpacity = 0
  }
  stack_rm2.addSpacer()

  if (reminders_today.length > 3)
  {
    const text_rm3 = stack_rm3.addText(reminders_today[3].name)
    text_rm3.font = FONT_REMINDER
    text_rm3.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm3 = stack_rm3.addText("reminder3")
    text_rm3.font = FONT_REMINDER
    text_rm3.textOpacity = 0
  }
  stack_rm3.addSpacer()

  if (reminders_today.length > 4)
  {
    const text_rm4 = stack_rm4.addText(reminders_today[4].name)
    text_rm4.font = FONT_REMINDER
    text_rm4.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm4 = stack_rm4.addText("reminder4")
    text_rm4.font = FONT_REMINDER
    text_rm4.textOpacity = 0
  }
  stack_rm4.addSpacer()

  if (reminders_today.length > 5)
  {
    const text_rm5 = stack_rm5.addText(reminders_today[5].name)
    text_rm5.font = FONT_REMINDER
    text_rm5.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm5 = stack_rm5.addText("reminder5")
    text_rm5.font = FONT_REMINDER
    text_rm5.textOpacity = 0
  }
  stack_rm5.addSpacer()

  if (reminders_today.length > 6)
  {
    const text_rm6 = stack_rm6.addText(reminders_today[6].name)
    text_rm6.font = FONT_REMINDER
    text_rm6.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm6 = stack_rm6.addText("reminder6")
    text_rm6.font = FONT_REMINDER
    text_rm6.textOpacity = 0
  }
  stack_rm6.addSpacer()

  if (reminders_today.length > 7)
  {
    const text_rm7 = stack_rm7.addText(reminders_today[7].name)
    text_rm7.font = FONT_REMINDER
    text_rm7.textColor = COLOR_TEXT
  }
  else
  {
    const text_rm7 = stack_rm7.addText("reminder7")
    text_rm7.font = FONT_REMINDER
    text_rm7.textOpacity = 0
  }
  stack_rm7.addSpacer()

  if (reminders_today.length == 8)
  {
    const text_summary = stack_summary.addText("... +1 more reminder")
    text_summary.font = FONT_SUMMARY
    text_summary.textColor = COLOR_TEXT
  }
  else if (reminders_today.length > 8)
  {
    const count = reminders_today.length - 2
    const text_summary = stack_summary.addText("... +" + count + " more reminders")
    text_summary.font = FONT_SUMMARY
    text_summary.textColor = COLOR_TEXT
  }
  else
  {
    const text_summary = stack_summary.addText("leftovers")
    text_summary.font = FONT_SUMMARY
    text_summary.textOpacity = 0
  }
  stack_summary.addSpacer()

  return widget
}

const widget = await buildMediumWidget()
widget.backgroundColor = COLOR_BG
widget.url = "calshow://"
Script.setWidget(widget)
Script.complete()
