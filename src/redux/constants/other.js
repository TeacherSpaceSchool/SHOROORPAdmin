export const month = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь'
]

export const monthWithDay = {
    'январь': 31,
    'февраль': 28,
    'март': 31,
    'апрель': 30,
    'май': 31,
    'июнь': 30,
    'июль': 31,
    'август': 31,
    'сентябрь': 30,
    'октябрь': 31,
    'ноябрь': 30,
    'декабрь': 31
}

export const previousMonth = {
    'январь': 'декабрь',
    'февраль': 'январь',
    'март': 'февраль',
    'апрель': 'март',
    'май': 'апрель',
    'июнь': 'май',
    'июль': 'июнь',
    'август': 'июль',
    'сентябрь': 'август',
    'октябрь': 'сентябрь',
    'ноябрь': 'октябрь',
    'декабрь': 'ноябрь'
}

export const skip = 10

export const getYesterday = (day) => {
    day = day.split(' ')
    day[0] -= 1
    if(day[0]===0){
        day[0] = monthWithDay[day[1]]
        day[1] = previousMonth[day[1]]
        if(day[1]==='декабрь'){
            day[2] -= 1
        }
    }
    return day[0]+' '+day[1]+' '+day[2]
}

export const checkInt = (int) => {
    return isNaN(parseInt(int))?0:parseInt(int)
}

export const getname = (arr) => {
    for(let i=0; i<arr.length; i++){
        arr[i] = arr[i].name
    }
    return arr
}