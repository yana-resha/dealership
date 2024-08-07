const MIN_CHILDREN_COUNT = 0
const MAX_CHILDREN_COUNT = 11
/** Помогает сформировать валидные данные для формы */
export const getChildrenCount = (min = MIN_CHILDREN_COUNT, max = MAX_CHILDREN_COUNT) =>
  [...Array(max - min + 1)].map((v, i) => ({ value: i + min }))
