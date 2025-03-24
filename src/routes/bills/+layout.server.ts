import type { LayoutServerLoad } from './$types';
import { DateTime } from 'luxon';

// yes, this state is shared by all users; that's ok
let bills: Array<Bill>;
let hearings: Map<string, Map<string, Array<Bill>>>;

let last_bills_retrieval: Date;
const BILLS_CACHE_EXPIRY: number = 4 * 3600 * 1000; // ms

// LSRs table
const LSRS_BILL_TITLE_INDEX: number = 2;
const LSRS_BILL_CODE_INDEX: number = 10;

// LSRsOnly table
const LSRS_ONLY_BILL_CODE_INDEX: number = 5;
const LSRS_ONLY_BILL_ID_INDEX: number = 2;

// Docket table
const DOCKET_BILL_CODE_INDEX: number = 3;
const DOCKET_BODY_INDEX: number = 4;
const DOCKET_DESCRIPTION_INDEX: number = 5;

// Committees table
const COMMITTEES_NAME_INDEX: number = 1;

// date/time regular expressions
const DATE_RE: RegExp = /(\d{2})\/(\d{2})\/(\d{4})/;
const TIME_RE: RegExp = /(\d{2}):(\d{2}) (am|pm)/;

async function fetchData(fetch: Function, url: string): Promise<string> {
  const response: Response = await fetch(url);
  return await response.text();
}

// returns an "invalid date" Date object if no date is found
function parse_date_from_description(description: string): Date {
  if (description) {
    const date_match = description.match(DATE_RE);
    const time_match = description.match(TIME_RE);

    if (date_match && time_match) {
      const [full_date, month, day, year] = date_match;
      const [full_time, hour, minute, ampm] = time_match;

      return DateTime.fromObject(
        {
          year: Number(year),
          month: Number(month),
          day: Number(day),
          hour: ampm == "am" ? Number(hour) : Number(hour) + 12,
          minute: Number(minute),
        },
        {
          zone: 'America/New_York'
        }
      ).toJSDate();
    }
  }

  return new Date("");
}

// returns empty string if committee is not found
function parse_committee_from_description(committees: Array<string>, description: string): string {
  if (description) {
    for (const committee of committees) {
      if (description.search(new RegExp(committee)) != -1) {
        return committee;
      }
    }
  }
  return "";
}

function get_house_committees(bill_docket: Array<DocketEntry>): Array<string> {
  return bill_docket.filter(
    docket_entry => !docket_entry.is_senate && docket_entry.committee
  ).map(
    docket_entry => docket_entry.committee
  );
}

export const load: LayoutServerLoad = async ({ fetch }) => {
  if (!bills || !last_bills_retrieval || new Date().getTime() - last_bills_retrieval.getTime() > BILLS_CACHE_EXPIRY) {

    // get LSRsOnly for mapping from bill name to bill id
    const lsrs_only = await fetchData(fetch, "https://gc.nh.gov/dynamicdatadump/LSRsOnly.txt");
    const bill_codes_to_ids: Map<string, number> = new Map(
      lsrs_only.split("\n").map(
        x => x.split("|")
      ).map(
        x => [x[LSRS_ONLY_BILL_CODE_INDEX], Number(x[LSRS_ONLY_BILL_ID_INDEX])]
      )
    );

    // get Committees just to enumerate committee names
    const committees_pipe_separated = await fetchData(fetch, "https://gc.nh.gov/dynamicdatadump/Committees.txt");
    const committees: Array<string> = committees_pipe_separated.split(
      "\n"
    ).filter(
      x => x
    ).map(
      x => x.split("|")[COMMITTEES_NAME_INDEX].trim()
    ).sort(
      // sort by descending length to ensure we match the most specific name first
      (a, b) => b.length - a.length
    );

    const docket = await fetchData(fetch, "https://gc.nh.gov/dynamicdatadump/Docket.txt");
    const docket_entries: Array<Array<string>> = docket.split("\n").map(x => x.split("|"));
    const bill_codes_to_dockets: Map<string, Array<DocketEntry>> = new Map();
    const bill_codes_to_committees: Map<string, string> = new Map();
    const bill_codes_to_upcoming_hearings: Map<string, Array<DocketEntry>> = new Map();
    const now: Date = new Date();
    for (const de of docket_entries) {
      const bill_code = de[DOCKET_BILL_CODE_INDEX];
      const description = de[DOCKET_DESCRIPTION_INDEX];
      const date = parse_date_from_description(description);
      const is_hearing = description?.search(/hearing/i) != -1;
      const is_senate = de[DOCKET_BODY_INDEX] == "S";

      // check for new committee and use it for this and subsequent docket entries if found
      const committee = parse_committee_from_description(committees, description);
      if (committee) {
        const fully_qualified_committee = (is_senate ? "Senate" : "House") + " " + committee;
        bill_codes_to_committees.set(bill_code, fully_qualified_committee);
      }

      const docket_entry: DocketEntry = {
        description, date, is_hearing, is_senate,
        committee: bill_codes_to_committees.get(bill_code) || "",
      };

      if (!bill_codes_to_dockets.has(bill_code)) {
        bill_codes_to_dockets.set(bill_code, []);
      }
      bill_codes_to_dockets.get(bill_code)?.push(docket_entry);

      if (docket_entry.is_hearing && docket_entry.date > now) {
        if (!bill_codes_to_upcoming_hearings.has(bill_code)) {
          bill_codes_to_upcoming_hearings.set(bill_code, []);
        }
        bill_codes_to_upcoming_hearings.get(bill_code)?.push(docket_entry);
      }
    }

    const lsrs = await fetchData(fetch, "https://gc.nh.gov/dynamicdatadump/LSRs.txt");
    bills = lsrs.split("\n").map(
      x => x.split("|")
    ).map(bill_fields => (
      {
        id: bill_codes_to_ids.get(bill_fields[LSRS_BILL_CODE_INDEX]) || -1,
        docket: bill_codes_to_dockets.get(bill_fields[LSRS_BILL_CODE_INDEX]) || [],
        title: bill_fields[LSRS_BILL_TITLE_INDEX],
        bill_code: bill_fields[LSRS_BILL_CODE_INDEX],
        house_committees: get_house_committees(bill_codes_to_dockets.get(bill_fields[LSRS_BILL_CODE_INDEX]) || []),
        upcoming_hearings: bill_codes_to_upcoming_hearings.get(bill_fields[LSRS_BILL_CODE_INDEX]),
      }
    ));

    // group bills with upcoming hearings by committee and date for convenience
    hearings = new Map();
    for (const bill of bills) {
      const committee = bill.upcoming_hearings?.[0].committee;
      const hearing_date = DateTime.fromJSDate(bill.upcoming_hearings?.[0].date).toLocaleString(DateTime.DATE_SHORT);
      if (committee && hearing_date) {
        if (!hearings.has(committee)) {
          hearings.set(committee, new Map());
        }
        if (!hearings.get(committee)?.has(hearing_date)) {
          hearings.get(committee)?.set(hearing_date, []);
        }
        hearings.get(committee)?.get(hearing_date)?.push(bill);
      }
    }
    // sort by committee name
    hearings = new Map([...hearings.entries()].sort());

    // for every committee, sort bills by hearing date
    for (const [committee, committe_hearings] of hearings) {
      hearings.set(committee, new Map([...committe_hearings.entries()].sort()));
    }

    last_bills_retrieval = new Date();
  }

  return {
    bills, hearings
  }
};