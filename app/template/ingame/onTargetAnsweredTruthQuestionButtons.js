exports.onTargetAnsweredTruthQuestionButtons = {
  type: 'template',
  altText: 'Did your friend tell the truth?',
  template: {
    type: 'confirm',
    actions: [
      {
        type: 'postback',
        label: 'Yes',
        data: 'action=truthvalidation&valid=true'
      },
      {
        type: 'message',
        label: 'No',
        data: 'action=truthvalidation&valid=true'
      }
    ],
    text: 'Did your friend tell the truth?'
  }
}