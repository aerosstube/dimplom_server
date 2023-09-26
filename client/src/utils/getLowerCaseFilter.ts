export const getLowerCaseFilter = (value: string) => {
    const res = value?.split('')?.map((letter, index: number) => {
        if (index === 0) {
            console.log(letter, 'lertte')
            return letter.toUpperCase()
        } else {
            return letter
        }
    })
    return res?.join('')
}