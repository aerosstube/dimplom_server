export const findNumberOfLesson = (date: any) => {
    if (date) {
        const dateHours = date.split('T')[1]
        switch (dateHours.split('.')[0]) {
            case '06:00:00':
                return 1
            case '07:50:00':
                return 2
            case '09:40:00':
                return 3
            case '11:30:00':
                return 4
        }
    }
}