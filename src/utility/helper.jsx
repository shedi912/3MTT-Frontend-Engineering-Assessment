
//convert from ISO to mysql standard i.e yyyy-mm-dd
export function convertDate(dateArg){
    const vArray = dateArg.toLocaleDateString('en-GB').split('/');
    return [vArray[2],vArray[1],vArray[0]].join('-');
}
