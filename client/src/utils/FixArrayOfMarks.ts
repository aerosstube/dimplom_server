export function fixArrayOfMarks(date: string[]) {
    for (let i = 0; i < date.length; i++) {
        if (date[i].split('')[1] === date[i + 1]?.split('')[1]) {
            date.splice(i + 1, 1)
        }
    }
    return date
}