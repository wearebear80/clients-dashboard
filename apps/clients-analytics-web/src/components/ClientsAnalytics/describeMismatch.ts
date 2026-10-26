/** How a total differs from the sum of its rows: shared by the table and the chart. */
export const describeMismatch = (total: number, sumOfChildren: number) =>
  `Rows add up to ${sumOfChildren}, ${Math.abs(sumOfChildren - total)} ${
    sumOfChildren < total ? 'less' : 'more'
  } than ${total}.`;
