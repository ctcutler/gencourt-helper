import { expect, test } from 'vitest'
import { _parse_date_from_description } from './+layout.server'
//import { _ } from '$env/static/private'
import { DateTime } from 'luxon';


test('parsing date from empty description', () => {
    expect(_parse_date_from_description("")).toEqual(new Date(""))
})

test('parsing date from bad description', () => {
    expect(_parse_date_from_description("foobar")).toEqual(new Date(""))
})

test('parsing date from good description', () => {
    const d: Date = DateTime.fromObject(
        { year: 2025, month: 1, day: 14, hour: 9, minute: 30, },
        { zone: 'America/New_York' }
    ).toJSDate();
    expect(_parse_date_from_description("Hearing: 01/14/2025, Room 103, LOB, 09:30 am;  SC 5")).toEqual(new Date(d));
})