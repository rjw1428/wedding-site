export const MENU = [{
  key: 'filet',
  value: 'Filet Mignon',
  description: 'grilled fliet mignon with red wine demi-glace'
},
{
  key: 'branzino',
  value: 'Branzino',
  description: 'pan seared branzino lemon white wine sauce'
},
{
  key: 'veggie',
  value: 'Vegetarian',
  description: 'roasted yellow bell pepper with quinoa salad, over wilted spinach and a tomato coulis'
}]

export const ATTENDING = [
  { key: true, value: 'Yes, Joyfully Accept' },
  { key: false, value: 'No, Regretfully Decline' },
]

export const BRUNCH = [
  { key: true, value: 'Yes' },
  { key: false, value: 'No' },
]

export const REHERSAL = [
  { key: true, value: 'Yes' },
  { key: false, value: 'No' },
]

export const SUBMISSION_RESPONSES = {
  success: [`Thank you for responding.`,  `We're excited to celebrate our special day with you.`],
  notComint: [`Thank you for responding.`,  `Your presence will be missed.`],
  error: ['Oh no, something went wrong']
}