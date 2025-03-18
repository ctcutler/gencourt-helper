type Bill = {
    id: number,
    title: string,
    bill_code: string,
    docket: Array[DocketEntry],
    upcoming_hearings: Array[DocketEntry],
}

type DocketEntry = {
    description: string,
    date: Date,
    is_hearing: Boolean,
    is_senate: Boolean,
    committee: string,
}

type Committee = {
    name: string,
    bills_with_hearings: Array<Bill>,
}