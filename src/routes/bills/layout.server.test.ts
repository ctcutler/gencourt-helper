import { expect, test, vi } from 'vitest';
import {
    _parse_date_from_description, _parse_committee_from_description, _get_house_committees, _build_bill_codes_to_ids, _fetch_data
} from './+layout.server';
import { DateTime } from 'luxon';

// hoisted above the imports above
const LSRsOnlyPSV: string = "25-0001|8023|6|2025|Sponsor|HB561|H|Bill Title 1\n25-0001|8023|6|2025|Sponsor|HB561|H|Bill Title 2";
vi.mock("./+layout.server", async () => {
    const originalModule = await vi.importActual('./+layout.server');
    return { 
        ...originalModule, 
        _fetch_data: vi.fn(() => LSRsOnlyPSV),
    };    
});

test('parsing date from empty/bad description', () => {
    expect(_parse_date_from_description("")).toEqual(new Date(""));
    expect(_parse_date_from_description("foobar")).toEqual(new Date(""));
});

test('parsing date from good description', () => {
    const d: Date = DateTime.fromObject(
        { year: 2025, month: 1, day: 14, hour: 9, minute: 30, },
        { zone: 'America/New_York' }
    ).toJSDate();
    expect(_parse_date_from_description("Hearing: 01/14/2025, Room 103, LOB, 09:30 am;  SC 5")).toEqual(new Date(d));
});

const committees = ["Commerce and Consumer Affairs", "Election Law"];
test('parsing committee from bad/empty description', () => {
    expect(_parse_committee_from_description(committees, "foobar")).toEqual("");
    expect(_parse_committee_from_description(committees, "")).toEqual("");
});

test('parsing committee from good description', () => {
    expect(
        _parse_committee_from_description(
            committees,
            "  Introduced 01/08/2025 and referred to Commerce and Consumer Affairs  HJ 2  P. 13"
        )
    ).toEqual("Commerce and Consumer Affairs");
});

const docket: Array<DocketEntry> = [
    { description: "", date: new Date(), is_hearing: true, is_senate: true, committee: "Election Law" },
    { description: "", date: new Date(), is_hearing: true, is_senate: false, committee: "Commerce and Consumer Affairs" },
];
test('getting house committees only', () => {
    expect(_get_house_committees(docket)).toEqual(["Commerce and Consumer Affairs"])
});

test('building bill code -> id mapping', async () => {
    expect(_build_bill_codes_to_ids()).toEqual({ "HB123": 12, "HB456": 13 })
});