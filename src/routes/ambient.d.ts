type Bill = {
    id: number,
    title: string,
    bill_code: string,
    docket: Array[DocketEntry],
}

type DocketEntry = {
    description: string,
    date: Date,
}