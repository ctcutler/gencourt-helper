type Bill = {
    id: number,
    title: string,
    bill_code: string,
    docket: Array[DocketEntry],
    upcoming_hearings: Array[DocketEntry],
    house_committees: Array<string>,
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

type DocketInfo = {
    bill_codes_to_dockets: Map<string, Array<DocketEntry>>,
    bill_codes_to_upcoming_hearings: Map<string, Array<DocketEntry>>,
}