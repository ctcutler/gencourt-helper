export function formatDate(d: Date): string {
    if (d) {
        return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
    } else {
        return '';
    }
}