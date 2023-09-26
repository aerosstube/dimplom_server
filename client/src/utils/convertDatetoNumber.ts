export const convertDateToNumber = (date: string) => {
    switch (date) {
        case '06:00:00.000Z' : {
            return 1;
        }
        case '07:50:00.000Z' : {
            return 2;
        }
        case '09:40:00.000Z' : {
            return 3;
        }
        case '11:30:00.000Z' : {
            return 4;
        }
        case '13:10:00.000Z': {
            return 5
        }
        default: {
            return 0
        }

    }
}