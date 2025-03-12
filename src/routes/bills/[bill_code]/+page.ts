import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    return { selected_bill_code: params.bill_code };
}